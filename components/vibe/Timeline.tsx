import React, { useRef, useState, useEffect } from "react";
import { useAudioStore } from "@/store/useAudioStore";
import { TrackControls } from "./TrackControls";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { LOOP_COLORS } from "@/lib/audioUtils";

const PIXELS_PER_BAR = 120;
const INITIAL_BARS = 128;

export function Timeline() {
  const { project, currentBar, draggedPlayheadBar, updateTrack, seekTo, setDraggedPlayheadBar } = useAudioStore();
  const [totalBars, setTotalBars] = useState(INITIAL_BARS);
  const [draggingClip, setDraggingClip] = useState<{
    trackId: string;
    clipIndex: number;
    startX: number;
    originalStartBar: number;
  } | null>(null);
  const [draggingPlayhead, setDraggingPlayhead] = useState<{
    startX: number;
    originalBar: number;
  } | null>(null);
  const [clipPreview, setClipPreview] = useState<{
    trackId: string;
    clipIndex: number;
    startBar: number;
  } | null>(null);

  const timelineScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!project) return;
    
    const maxBarUsed = Math.max(
      currentBar,
      ...project.tracks.flatMap(track => 
        track.clips.map(clip => clip.startBar + clip.durationBars)
      )
    );

    if (maxBarUsed > totalBars - 16) {
      setTotalBars(prev => prev + 64);
    }
  }, [currentBar, project, totalBars]);

  useEffect(() => {
    if (timelineScrollRef.current && !draggingPlayhead) {
      const scrollContainer = timelineScrollRef.current;
      // Use draggedPlayheadBar when it exists (after drag release), otherwise use currentBar
      const targetBar = draggedPlayheadBar !== null ? draggedPlayheadBar : currentBar;
      const playheadPosition = targetBar * PIXELS_PER_BAR;
      const containerWidth = scrollContainer.clientWidth;
      const centerPosition = playheadPosition - containerWidth / 2;
      
      scrollContainer.scrollTo({
        left: Math.max(0, centerPosition),
        behavior: 'smooth'
      });
    }
  }, [currentBar, draggedPlayheadBar, draggingPlayhead]);

  useEffect(() => {
    // Clear draggedPlayheadBar once currentBar has caught up after seek
    if (draggedPlayheadBar !== null && !draggingPlayhead && Math.abs(currentBar - draggedPlayheadBar) < 0.1) {
      console.log('Clearing draggedPlayheadBar, currentBar caught up:', currentBar);
      setDraggedPlayheadBar(null);
    }
  }, [currentBar, draggedPlayheadBar, draggingPlayhead, setDraggedPlayheadBar]);

  if (!project)
    return <div className="p-10 text-center">No Project Loaded</div>;

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (draggingClip && clipPreview) {
        const track = project.tracks.find((t) => t.id === clipPreview.trackId);
        if (track) {
          const newClips = [...track.clips];
          newClips[clipPreview.clipIndex] = {
            ...newClips[clipPreview.clipIndex],
            startBar: clipPreview.startBar,
          };
          updateTrack(clipPreview.trackId, { clips: newClips });
        }
      }

      if (draggingPlayhead && draggedPlayheadBar !== null) {
        console.log('Seeking to:', draggedPlayheadBar);
        seekTo(draggedPlayheadBar); // Seek to final dragged position
        // Don't clear draggedPlayheadBar here - let it persist until currentBar catches up
      }

      setDraggingClip(null);
      setDraggingPlayhead(null);
      setClipPreview(null);
    };

    document.addEventListener("mouseup", handleGlobalMouseUp);
    return () => {
      document.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [project, updateTrack, seekTo, setDraggedPlayheadBar, draggingClip, clipPreview, draggingPlayhead, draggedPlayheadBar]);

  const handleMouseDown = (
    e: React.MouseEvent,
    trackId: string,
    clipIndex: number,
    currentStartBar: number
  ) => {
    e.stopPropagation();
    setDraggingClip({
      trackId,
      clipIndex,
      startX: e.clientX,
      originalStartBar: currentStartBar,
    });
    setClipPreview({
      trackId,
      clipIndex,
      startBar: currentStartBar,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingPlayhead) {
      const deltaX = e.clientX - draggingPlayhead.startX;
      const deltaBars = Math.round(deltaX / PIXELS_PER_BAR);

      let newBar = draggingPlayhead.originalBar + deltaBars;
      if (newBar < 0) newBar = 0;

      if (newBar >= totalBars - 8) {
        setTotalBars(prev => prev + 32);
      }

      console.log('Dragging to bar:', newBar);
      // Update global state during drag
      setDraggedPlayheadBar(newBar);
      return;
    }

    if (!draggingClip) return;
    const deltaX = e.clientX - draggingClip.startX;
    const deltaBars = Math.round(deltaX / PIXELS_PER_BAR);

    let newStartBar = draggingClip.originalStartBar + deltaBars;
    if (newStartBar < 0) newStartBar = 0;

    if (newStartBar >= totalBars - 8) {
      setTotalBars(prev => prev + 32);
    }

    setClipPreview({
      trackId: draggingClip.trackId,
      clipIndex: draggingClip.clipIndex,
      startBar: newStartBar,
    });
  };

  const handlePlayheadMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Use draggedPlayheadBar if it exists (more accurate), otherwise currentBar
    const startBar = draggedPlayheadBar !== null ? draggedPlayheadBar : currentBar;
    console.log('Playhead mousedown', startBar);
    setDraggingPlayhead({
      startX: e.clientX,
      originalBar: startBar,
    });
    setDraggedPlayheadBar(startBar);
  };

  const handleDrop = (e: React.DragEvent, trackId: string) => {
    e.preventDefault();
    const soundData = e.dataTransfer.getData("application/json");
    if (!soundData) return;

    try {
      const sound = JSON.parse(soundData);
      const bounds = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const dropBar = Math.floor(x / PIXELS_PER_BAR);

      const track = project.tracks.find((t) => t.id === trackId);
      if (track) {
        const isOccupied = track.clips.some(
          (c) => dropBar >= c.startBar && dropBar < c.startBar + c.durationBars
        );
        if (!isOccupied) {
          updateTrack(trackId, {
            clips: [
              ...track.clips,
              {
                startBar: dropBar,
                durationBars: 2,
                notes: [],
              },
            ],
          });
        }
      }
    } catch (error) {
      console.error("Failed to parse sound data:", error);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleTrackClick = (trackId: string, e: React.MouseEvent) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const clickedBar = Math.floor(x / PIXELS_PER_BAR);

    const track = project.tracks.find((t) => t.id === trackId);
    if (track) {
      const isOccupied = track.clips.some(
        (c) =>
          clickedBar >= c.startBar && clickedBar < c.startBar + c.durationBars
      );
      if (!isOccupied) {
        updateTrack(trackId, {
          clips: [
            ...track.clips,
            { startBar: clickedBar, durationBars: 1, notes: [] },
          ],
        });
      }
    }
  };

  const deleteClip = (
    e: React.MouseEvent,
    trackId: string,
    clipIndex: number
  ) => {
    e.stopPropagation();
    if (e.shiftKey || e.button === 2) {
      e.preventDefault();
      const track = project.tracks.find((t) => t.id === trackId);
      if (track) {
        const newClips = [...track.clips];
        newClips.splice(clipIndex, 1);
        updateTrack(trackId, { clips: newClips });
      }
    }
  };

  return (
    <div className="flex-1 bg-zinc-950 relative select-none flex flex-col h-full">
      <div className="flex h-8 border-b border-zinc-800 bg-zinc-900/90 backdrop-blur z-10 shadow-lg shrink-0">
        <div className="w-56 shrink-0 border-r border-zinc-800"></div>
        <ScrollArea className="flex-1" orientation="horizontal">
          <div className="flex h-8" style={{ width: totalBars * PIXELS_PER_BAR }}>
            {Array.from({ length: totalBars }).map((_, i) => (
              <div
                key={i}
                className="shrink-0 border-l border-zinc-700/50 px-1 text-[10px] font-mono text-zinc-500"
                style={{ width: PIXELS_PER_BAR }}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
      <div className="flex-1 flex min-h-0">
        <ScrollArea className="w-56shrink-0 border-r border-zinc-800 bg-zinc-950 overflow-y-auto">
          <div className="flex flex-col">
            {project.tracks.map((track) => (
              <TrackControls key={track.id} track={track} />
            ))}
          </div>
        </ScrollArea>
        <div 
          ref={timelineScrollRef} 
          className="flex-1 overflow-auto relative scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent hover:scrollbar-thumb-zinc-600"
        >
          <div 
            className="relative"
            onMouseMove={handleMouseMove}
            style={{ 
              width: totalBars * PIXELS_PER_BAR,
              minHeight: "100%",
              backgroundImage: "radial-gradient(circle at 50% 50%, #18181b 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          >
            {project.tracks.map((track) => (
              <div
                key={track.id}
                className="border-b border-zinc-800/50 hover:bg-zinc-900/50 transition-colors"
              >
                <div
                  className="relative h-24 bg-zinc-900/20"
                  onClick={(e) => handleTrackClick(track.id, e)}
                  onDrop={(e) => handleDrop(e, track.id)}
                  onDragOver={handleDragOver}
                >
                  <div className="absolute inset-0 flex pointer-events-none">
                    {Array.from({ length: totalBars }).map((_, i) => (
                      <div
                        key={i}
                        className="shrink-0 border-r border-dashed border-zinc-800/30 h-full"
                        style={{ width: PIXELS_PER_BAR }}
                      ></div>
                    ))}
                  </div>

                  {track.clips.map((clip, idx) => {
                    const isBeingDragged =
                      clipPreview &&
                      clipPreview.trackId === track.id &&
                      clipPreview.clipIndex === idx;
                    const displayStartBar = isBeingDragged
                      ? clipPreview.startBar
                      : clip.startBar;

                    return (
                      <div
                        key={`${clip.startBar}-${idx}`}
                        className={cn(
                          "absolute top-1 bottom-1 rounded border-t border-white/20 border-b shadow-md cursor-grab active:cursor-grabbing flex items-center justify-center overflow-hidden",
                          LOOP_COLORS[track.type] || "bg-zinc-700",
                          "after:absolute after:inset-0 after:bg-linear-to-b after:from-white/10 after:to-transparent hover:brightness-110",
                          isBeingDragged ? "" : "transition-all"
                        )}
                        style={{
                          left: displayStartBar * PIXELS_PER_BAR,
                          width: clip.durationBars * PIXELS_PER_BAR,
                        }}
                        onMouseDown={(e) =>
                          handleMouseDown(e, track.id, idx, clip.startBar)
                        }
                        onContextMenu={(e) => deleteClip(e, track.id, idx)}
                        onClick={(e) => e.stopPropagation()}
                        title="Drag to move, Shift+Click or Right Click to delete"
                      >
                        <div className="relative z-10 text-white/90 text-[10px] font-bold pointer-events-none truncate px-2 drop-shadow-md">
                          {track.instrument?.type || "Clip"}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            
            <div
              className={cn(
                "absolute top-0 bottom-0 z-20 cursor-grab active:cursor-grabbing group",
                draggingPlayhead ? "" : "transition-all duration-75"
              )}
              style={{
                left:
                  (draggedPlayheadBar !== null ? draggedPlayheadBar : currentBar) *
                  PIXELS_PER_BAR,
              }}
              onMouseDown={handlePlayheadMouseDown}
              title="Drag to scrub timeline"
            >
              <div className="absolute -left-5 top-0 bottom-0 w-10"></div>
              <div className="absolute top-0 -left-1.5 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-8 border-t-cyan-500"></div>
              <div className="absolute -left-0.5 top-0 bottom-0 w-0.5 bg-cyan-500 shadow-[0_0_10px_2px_rgba(6,182,212,0.5)] group-hover:w-1 group-hover:shadow-[0_0_15px_3px_rgba(6,182,212,0.6)] transition-all"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
