import React, { useRef, useState } from 'react';
import { useAudioStore } from '@/store/useAudioStore';
import { TrackControls } from './TrackControls';
import { cn } from '@/lib/utils';
import { LOOP_COLORS } from '@/lib/audioUtils';

const PIXELS_PER_BAR = 120;
const TOTAL_BARS = 32; // Fixed canvas size for prototype

export function Timeline() {
    const { project, currentBar, updateTrack } = useAudioStore();
    const [draggingClip, setDraggingClip] = useState<{ trackId: string, clipIndex: number, startX: number, originalStartBar: number } | null>(null);

    if (!project) return <div className="p-10 text-center">No Project Loaded</div>;

    const handleMouseDown = (e: React.MouseEvent, trackId: string, clipIndex: number, currentStartBar: number) => {
        e.stopPropagation();
        setDraggingClip({
            trackId,
            clipIndex,
            startX: e.clientX,
            originalStartBar: currentStartBar
        });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!draggingClip) return;
        const deltaX = e.clientX - draggingClip.startX;
        const deltaBars = Math.round(deltaX / PIXELS_PER_BAR);
        
        let newStartBar = draggingClip.originalStartBar + deltaBars;
        if (newStartBar < 0) newStartBar = 0;
        
        // Update store logic would be debounced ideally, but here direct.
        // We only commit on MouseUp to avoid excessive store updates/re-renders or maybe just local state?
        // Let's do live update for "wow" factor, but need to be careful with store perf.
        // Actually, let's just update on mouse up for safety, or use a local 'preview' offset.
        // But implementing 'preview' is extra code. I'll update store.
        
        const track = project.tracks.find(t => t.id === draggingClip.trackId);
        if (track) {
            const newClips = [...track.clips];
            newClips[draggingClip.clipIndex] = {
                ...newClips[draggingClip.clipIndex],
                startBar: newStartBar
            };
            updateTrack(draggingClip.trackId, { clips: newClips });
        }
    };

    const handleMouseUp = () => {
        setDraggingClip(null);
    };

    const handleTrackClick = (trackId: string, e: React.MouseEvent) => {
        // Add clip at clicked position
        const bounds = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - bounds.left;
        const clickedBar = Math.floor(x / PIXELS_PER_BAR);
        
        const track = project.tracks.find(t => t.id === trackId);
        if (track) {
            // Check if occupied
            // Simple check
            const isOccupied = track.clips.some(c => 
                (clickedBar >= c.startBar && clickedBar < c.startBar + c.durationBars)
            );
            if (!isOccupied) {
                updateTrack(trackId, {
                    clips: [...track.clips, { startBar: clickedBar, durationBars: 1 }]
                });
            }
        }
    };

    const deleteClip = (e: React.MouseEvent, trackId: string, clipIndex: number) => {
        e.stopPropagation();
        // Right click to delete? Or Shift Click.
        if (e.shiftKey || e.button === 2) {
             e.preventDefault();
             const track = project.tracks.find(t => t.id === trackId);
             if (track) {
                 const newClips = [...track.clips];
                 newClips.splice(clipIndex, 1);
                 updateTrack(trackId, { clips: newClips });
             }
        }
    }

    return (
        <div 
            className="flex-1 overflow-auto bg-background/50 relative select-none"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            <div className="flex flex-col min-w-[max-content]">
                 {/* Ruler */}
                 <div className="flex h-8 border-b pl-64 sticky top-0 bg-background z-10 w-full">
                     {Array.from({ length: TOTAL_BARS }).map((_, i) => (
                         <div key={i} className="flex-shrink-0 border-l px-1 text-xs text-muted-foreground" style={{ width: PIXELS_PER_BAR }}>
                             {i + 1}
                         </div>
                     ))}
                 </div>

                 {/* Tracks */}
                 {project.tracks.map(track => (
                     <div key={track.id} className="flex border-b hover:bg-muted/10">
                         <TrackControls track={track} />
                         
                         {/* Lane */}
                         <div 
                            className="relative h-24 flex-1 bg-gradient-to-r from-transparent to-muted/5 w-[3840px]" // 32 * 120
                            onClick={(e) => handleTrackClick(track.id, e)}
                         >
                                {/* Grid Lines */}
                                <div className="absolute inset-0 flex pointer-events-none">
                                     {Array.from({ length: TOTAL_BARS }).map((_, i) => (
                                         <div key={i} className="flex-shrink-0 border-r border-dashed border-border/20 h-full" style={{ width: PIXELS_PER_BAR }}></div>
                                     ))}
                                </div>
                                
                                {/* Clips */}
                                {track.clips.map((clip, idx) => (
                                    <div
                                        key={`${clip.startBar}-${idx}`}
                                        className={cn(
                                            "absolute top-2 bottom-2 rounded-md border border-white/10 shadow-sm cursor-grab active:cursor-grabbing flex items-center justify-center overflow-hidden",
                                            LOOP_COLORS[track.type] || "bg-zinc-700",
                                            "opacity-80 hover:opacity-100"
                                        )}
                                        style={{
                                            left: clip.startBar * PIXELS_PER_BAR,
                                            width: clip.durationBars * PIXELS_PER_BAR
                                        }}
                                        onMouseDown={(e) => handleMouseDown(e, track.id, idx, clip.startBar)}
                                        onContextMenu={(e) => deleteClip(e, track.id, idx)}
                                        onClick={(e) => e.stopPropagation()} // Prevent adding clip underneath
                                        title="Drag to move, Shift+Click or Right Click to delete"
                                    >
                                        <div className="text-white/50 text-xs font-bold pointer-events-none truncate px-1">
                                            {track.loopId}
                                        </div>
                                    </div>
                                ))}
                         </div>
                     </div>
                 ))}
                 
                 {/* Playhead */}
                 <div 
                    className="absolute top-8 bottom-0 w-0.5 bg-red-500 z-20 pointer-events-none transition-all duration-75"
                    style={{ left: 256 + (currentBar * PIXELS_PER_BAR) }} // 256 is sidebar width (w-64)
                 />
            </div>
        </div>
    );
}
