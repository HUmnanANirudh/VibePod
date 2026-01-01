import React, { useRef, useState, useEffect } from "react";
import { useAudioStore } from "@/store/useAudioStore";
import { TrackControls } from "./TrackControls";
import { ClipEditor } from "./ClipEditor";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CopiedClipIndicator } from "./timeline/CopiedClipIndicator";
import { DeleteClipDialog } from "./timeline/DeleteClipDialog";
import { TimelineRuler } from "./timeline/TimelineRuler";
import { Playhead } from "./timeline/Playhead";
import { TimelineClip } from "./timeline/TimelineClip";
import { TimelineGrid } from "./timeline/TimelineGrid";

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
  const [copiedClip, setCopiedClip] = useState<{
    trackId: string;
    clip: any;
  } | null>(null);
  const [selectedClip, setSelectedClip] = useState<{
    trackId: string;
    clipIndex: number;
  } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    trackId: string;
    clipIndex: number;
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
    if (!draggingPlayhead || !timelineScrollRef.current) return;
    
    const scrollContainer = timelineScrollRef.current;
    const targetBar = draggedPlayheadBar !== null ? draggedPlayheadBar : currentBar;
    const playheadPosition = targetBar * PIXELS_PER_BAR;
    const containerWidth = scrollContainer.clientWidth;
    const centerPosition = playheadPosition - containerWidth / 2;
    
    scrollContainer.scrollTo({
      left: Math.max(0, centerPosition),
      behavior: 'auto'
    });
  }, [draggedPlayheadBar, draggingPlayhead]);

  useEffect(() => {
    if (draggedPlayheadBar !== null && !draggingPlayhead && Math.abs(currentBar - draggedPlayheadBar) < 0.01) {
      // Reset dragged playhead only after successful seek
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
        // Only seek if position actually changed
        if (Math.abs(draggedPlayheadBar - draggingPlayhead.originalBar) > 0.1) {
          seekTo(Math.floor(draggedPlayheadBar));
        } else {
          // Reset if no movement
          setDraggedPlayheadBar(null);
        }
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
      const deltaBars = deltaX / PIXELS_PER_BAR; // Don't round for smooth dragging

      let newBar = draggingPlayhead.originalBar + deltaBars;
      if (newBar < 0) newBar = 0;

      if (newBar >= totalBars - 8) {
        setTotalBars(prev => prev + 32);
      }

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
    e.preventDefault();
    const currentPosition = draggedPlayheadBar !== null ? draggedPlayheadBar : currentBar;
    setDraggingPlayhead({
      startX: e.clientX,
      originalBar: currentPosition,
    });
    setDraggedPlayheadBar(currentPosition);
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
                volume: 0.8,
                pitch: 0,
                effect: 'None',
                effectAmount: 0.5,
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
    if (copiedClip && (e.ctrlKey || e.metaKey)) {
      pasteClip(e, trackId);
      return;
    }

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
            { 
              startBar: clickedBar, 
              durationBars: 1, 
              notes: [],
              volume: 0.8,
              pitch: 0,
              effect: 'None',
              effectAmount: 0.5,
            },
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
    setDeleteConfirm({ trackId, clipIndex });
  };

  const confirmDelete = () => {
    if (!deleteConfirm) return;
    const { trackId, clipIndex } = deleteConfirm;
    const track = project.tracks.find((t) => t.id === trackId);
    if (track) {
      const newClips = [...track.clips];
      newClips.splice(clipIndex, 1);
      updateTrack(trackId, { clips: newClips });
    }
    setDeleteConfirm(null);
  };

  const copyClip = (e: React.MouseEvent, trackId: string, clipIndex: number) => {
    e.stopPropagation();
    const track = project.tracks.find((t) => t.id === trackId);
    if (track) {
      setCopiedClip({ trackId, clip: { ...track.clips[clipIndex] } });
      const button = e.currentTarget as HTMLElement;
      button.style.background = '#10b981';
      button.style.borderColor = '#059669';
      setTimeout(() => {
        button.style.background = '';
        button.style.borderColor = '';
      }, 300);
      setTimeout(() => {
        setCopiedClip(null);
      }, 5000);
    }
  };

  const pasteClip = (e: React.MouseEvent, targetTrackId: string) => {
    e.stopPropagation();
    if (!copiedClip) return;

    const bounds = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const pasteBar = Math.floor(x / PIXELS_PER_BAR);

    const track = project.tracks.find((t) => t.id === targetTrackId);
    if (track) {
      const isOccupied = track.clips.some(
        (c) => pasteBar >= c.startBar && pasteBar < c.startBar + c.durationBars
      );
      if (!isOccupied) {
        updateTrack(targetTrackId, {
          clips: [
            ...track.clips,
            { ...copiedClip.clip, startBar: pasteBar },
          ],
        });
      }
    }
  };

  const handleClipClick = (e: React.MouseEvent, trackId: string, clipIndex: number) => {
    e.stopPropagation();
    setSelectedClip({ trackId, clipIndex });
  };

  return (
    <div className="flex-1 bg-zinc-950 relative select-none flex flex-col h-full">
      <CopiedClipIndicator show={!!copiedClip} />
      
      <TimelineRuler totalBars={totalBars} pixelsPerBar={PIXELS_PER_BAR} />
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
                  <TimelineGrid totalBars={totalBars} pixelsPerBar={PIXELS_PER_BAR} />

                  {track.clips.map((clip, idx) => {
                    const isBeingDragged =
                      clipPreview &&
                      clipPreview.trackId === track.id &&
                      clipPreview.clipIndex === idx;
                    const displayStartBar = isBeingDragged
                      ? clipPreview.startBar
                      : clip.startBar;
                    const isCopied = copiedClip?.trackId === track.id && copiedClip?.clip.startBar === clip.startBar;

                    return (
                      <TimelineClip
                        key={`${clip.startBar}-${idx}`}
                        clip={clip}
                        clipIndex={idx}
                        trackId={track.id}
                        trackType={track.type}
                        trackInstrumentType={track.instrument?.type}
                        displayStartBar={displayStartBar}
                        pixelsPerBar={PIXELS_PER_BAR}
                        isBeingDragged={!!isBeingDragged}
                        isCopied={isCopied}
                        onMouseDown={(e) => handleMouseDown(e, track.id, idx, clip.startBar)}
                        onClick={(e) => handleClipClick(e, track.id, idx)}
                        onCopy={(e) => copyClip(e, track.id, idx)}
                        onDelete={(e) => deleteClip(e, track.id, idx)}
                        copiedClip={copiedClip}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
            
            <Playhead
              currentBar={currentBar}
              draggedPlayheadBar={draggedPlayheadBar}
              pixelsPerBar={PIXELS_PER_BAR}
              draggingPlayhead={!!draggingPlayhead}
              onMouseDown={handlePlayheadMouseDown}
            />
          </div>
        </div>
      </div>

      {selectedClip && (
        <ClipEditor
          open={true}
          onClose={() => setSelectedClip(null)}
          trackId={selectedClip.trackId}
          clipIndex={selectedClip.clipIndex}
        />
      )}

      <DeleteClipDialog
        open={!!deleteConfirm}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  );
}