import React, { useRef, useState, useEffect } from "react";
import { useAudioStore } from "@/store/useAudioStore";
import { TrackControls } from "./TrackControls";
import { cn } from "@/lib/utils";
import { LOOP_COLORS } from "@/lib/audioUtils";

const PIXELS_PER_BAR = 120;
const TOTAL_BARS = 128;

export function Timeline() {
  const { project, currentBar, updateTrack, seekTo } = useAudioStore();
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
  const [playheadPreview, setPlayheadPreview] = useState<number | null>(null);
  const [clipPreview, setClipPreview] = useState<{
    trackId: string;
    clipIndex: number;
    startBar: number;
  } | null>(null);

  // Refs to store current values for event handlers
  const draggingClipRef = useRef(draggingClip);
  const clipPreviewRef = useRef(clipPreview);
  const draggingPlayheadRef = useRef(draggingPlayhead);
  const playheadPreviewRef = useRef(playheadPreview);

  useEffect(() => {
    draggingClipRef.current = draggingClip;
    clipPreviewRef.current = clipPreview;
    draggingPlayheadRef.current = draggingPlayhead;
    playheadPreviewRef.current = playheadPreview;
  }, [draggingClip, clipPreview, draggingPlayhead, playheadPreview]);

  useEffect(() => {
    if (
      playheadPreview !== null &&
      !draggingPlayhead &&
      Math.abs(currentBar - playheadPreview) < 0.1
    ) {
      setPlayheadPreview(null);
    }
  }, [currentBar, playheadPreview, draggingPlayhead]);

  if (!project)
    return <div className="p-10 text-center">No Project Loaded</div>;

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (draggingClipRef.current && clipPreviewRef.current) {
        const track = project.tracks.find(
          (t) => t.id === clipPreviewRef.current!.trackId
        );
        if (track) {
          const newClips = [...track.clips];
          newClips[clipPreviewRef.current.clipIndex] = {
            ...newClips[clipPreviewRef.current.clipIndex],
            startBar: clipPreviewRef.current.startBar,
          };
          updateTrack(clipPreviewRef.current.trackId, { clips: newClips });
        }
      }

      if (draggingPlayheadRef.current && playheadPreviewRef.current !== null) {
        seekTo(playheadPreviewRef.current);
      }

      setDraggingClip(null);
      setDraggingPlayhead(null);
      setClipPreview(null);

      if (!draggingPlayheadRef.current) {
        setPlayheadPreview(null);
      }
    };

    document.addEventListener("mouseup", handleGlobalMouseUp);
    return () => {
      document.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [project, updateTrack, seekTo]);

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
      if (newBar >= TOTAL_BARS) newBar = TOTAL_BARS - 1;

      setPlayheadPreview(newBar);
      return;
    }

    if (!draggingClip) return;
    const deltaX = e.clientX - draggingClip.startX;
    const deltaBars = Math.round(deltaX / PIXELS_PER_BAR);

    let newStartBar = draggingClip.originalStartBar + deltaBars;
    if (newStartBar < 0) newStartBar = 0;

    setClipPreview({
      trackId: draggingClip.trackId,
      clipIndex: draggingClip.clipIndex,
      startBar: newStartBar,
    });
  };

  const handlePlayheadMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDraggingPlayhead({
      startX: e.clientX,
      originalBar: currentBar,
    });
    setPlayheadPreview(currentBar);
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
        // Check if position is occupied
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
    <div
      className="flex-1 overflow-auto bg-zinc-950 relative select-none"
      style={{
        backgroundImage:
          "radial-gradient(circle at 50% 50%, #18181b 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
      onMouseMove={handleMouseMove}
    >
      <div className="flex flex-col min-w-max">
        {/* Ruler */}
        <div className="flex h-8 border-b border-zinc-800 pl-64 sticky top-0 bg-zinc-900/90 backdrop-blur z-10 w-full shadow-lg">
          {Array.from({ length: TOTAL_BARS }).map((_, i) => (
            <div
              key={i}
              className="shrink border-l border-zinc-700/50 px-1 text-[10px] font-mono text-zinc-500"
              style={{ width: PIXELS_PER_BAR }}
            >
              {i + 1}
            </div>
          ))}
        </div>

        {/* Tracks */}
        {project.tracks.map((track) => (
          <div
            key={track.id}
            className="flex border-b border-zinc-800/50 hover:bg-zinc-900/50 transition-colors"
          >
            <TrackControls track={track} />

            {/* Lane */}
            <div
              className="relative h-24 flex-1 w-md bg-zinc-900/20"
              onClick={(e) => handleTrackClick(track.id, e)}
              onDrop={(e) => handleDrop(e, track.id)}
              onDragOver={handleDragOver}
            >
              <div className="absolute inset-0 flex pointer-events-none">
                {Array.from({ length: TOTAL_BARS }).map((_, i) => (
                  <div
                    key={i}
                    className="shrink border-r border-dashed border-zinc-800/30 h-full"
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
              256 +
              (playheadPreview !== null ? playheadPreview : currentBar) *
                PIXELS_PER_BAR,
          }}
          onMouseDown={handlePlayheadMouseDown}
          title="Drag to scrub timeline"
        >
          <div className="absolute -left-3 top-0 bottom-0 w-6"></div>
          <div className="absolute top-0 -left-1.5 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-8 border-t-cyan-500"></div>
          <div className="absolute -left-0.5 top-8 bottom-0 w-0.5 bg-cyan-500 shadow-[0_0_10px_2px_rgba(6,182,212,0.5)] group-hover:w-1 transition-all"></div>
        </div>
      </div>
    </div>
  );
}
