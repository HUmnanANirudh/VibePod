import React, { useRef, useState } from 'react';
import { useAudioStore } from '@/store/useAudioStore';
import { TrackControls } from './TrackControls';
import { cn } from '@/lib/utils';
import { LOOP_COLORS } from '@/lib/audioUtils';

const PIXELS_PER_BAR = 120;
const TOTAL_BARS = 128;

export function Timeline() {
    const { project, currentBar, updateTrack, seekTo } = useAudioStore();
    const [draggingClip, setDraggingClip] = useState<{ trackId: string, clipIndex: number, startX: number, originalStartBar: number } | null>(null);
    const [draggingPlayhead, setDraggingPlayhead] = useState<{ startX: number, originalBar: number } | null>(null);
    const [playheadPreview, setPlayheadPreview] = useState<number | null>(null);

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
        // Handle playhead dragging
        if (draggingPlayhead) {
            const deltaX = e.clientX - draggingPlayhead.startX;
            const deltaBars = Math.round(deltaX / PIXELS_PER_BAR);
            
            let newBar = draggingPlayhead.originalBar + deltaBars;
            if (newBar < 0) newBar = 0;
            if (newBar >= TOTAL_BARS) newBar = TOTAL_BARS - 1;
            
            setPlayheadPreview(newBar);
            return;
        }

        // Handle clip dragging
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
        // Commit playhead position on mouse up
        if (draggingPlayhead && playheadPreview !== null) {
            seekTo(playheadPreview);
        }
        setDraggingClip(null);
        setDraggingPlayhead(null);
        setPlayheadPreview(null);
    };

    const handlePlayheadMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation();
        setDraggingPlayhead({
            startX: e.clientX,
            originalBar: currentBar
        });
    };

    const handleDrop = (e: React.DragEvent, trackId: string) => {
        e.preventDefault();
        const soundData = e.dataTransfer.getData('application/json');
        if (!soundData) return;
        
        try {
            const sound = JSON.parse(soundData);
            const bounds = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - bounds.left;
            const dropBar = Math.floor(x / PIXELS_PER_BAR);
            
            const track = project.tracks.find(t => t.id === trackId);
            if (track) {
                // Check if position is occupied
                const isOccupied = track.clips.some(c => 
                    (dropBar >= c.startBar && dropBar < c.startBar + c.durationBars)
                );
                if (!isOccupied) {
                    updateTrack(trackId, {
                        clips: [...track.clips, { 
                            startBar: dropBar, 
                            durationBars: 2, 
                            notes: []
                        }]
                    });
                }
            }
        } catch (error) {
            console.error('Failed to parse sound data:', error);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
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
                    clips: [...track.clips, { startBar: clickedBar, durationBars: 1, notes: [] }]
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
            className="flex-1 overflow-auto bg-zinc-950 relative select-none"
            style={{
                backgroundImage: 'radial-gradient(circle at 50% 50%, #18181b 1px, transparent 1px)',
                backgroundSize: '24px 24px'
            }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            <div className="flex flex-col min-w-max">
                 {/* Ruler */}
                 <div className="flex h-8 border-b border-zinc-800 pl-64 sticky top-0 bg-zinc-900/90 backdrop-blur z-10 w-full shadow-lg">
                     {Array.from({ length: TOTAL_BARS }).map((_, i) => (
                         <div key={i} className="shrink border-l border-zinc-700/50 px-1 text-[10px] font-mono text-zinc-500" style={{ width: PIXELS_PER_BAR }}>
                             {i + 1}
                         </div>
                     ))}
                 </div>

                 {/* Tracks */}
                 {project.tracks.map(track => (
                     <div key={track.id} className="flex border-b border-zinc-800/50 hover:bg-zinc-900/50 transition-colors">
                         <TrackControls track={track} />
                         
                         {/* Lane */}
                         <div 
                            className="relative h-24 flex-1 w-md bg-zinc-900/20" 
                            onClick={(e) => handleTrackClick(track.id, e)}
                            onDrop={(e) => handleDrop(e, track.id)}
                            onDragOver={handleDragOver}
                         >
                                {/* Grid Lines */}
                                <div className="absolute inset-0 flex pointer-events-none">
                                     {Array.from({ length: TOTAL_BARS }).map((_, i) => (
                                         <div key={i} className="shrink border-r border-dashed border-zinc-800/30 h-full" style={{ width: PIXELS_PER_BAR }}></div>
                                     ))}
                                </div>
                                
                                {/* Clips */}
                                {track.clips.map((clip, idx) => (
                                    <div
                                        key={`${clip.startBar}-${idx}`}
                                        className={cn(
                                            "absolute top-1 bottom-1 rounded border-t border-white/20 border-b shadow-md cursor-grab active:cursor-grabbing flex items-center justify-center overflow-hidden",
                                            LOOP_COLORS[track.type] || "bg-zinc-700",
                                            "after:absolute after:inset-0 after:bg-linear-to-b after:from-white/10 after:to-transparent hover:brightness-110 transition-all",
                                        )}
                                        style={{
                                            left: clip.startBar * PIXELS_PER_BAR,
                                            width: clip.durationBars * PIXELS_PER_BAR
                                        }}
                                        onMouseDown={(e) => handleMouseDown(e, track.id, idx, clip.startBar)}
                                        onContextMenu={(e) => deleteClip(e, track.id, idx)}
                                        onClick={(e) => e.stopPropagation()} 
                                        title="Drag to move, Shift+Click or Right Click to delete"
                                    >
                                        <div className="relative z-10 text-white/90 text-[10px] font-bold pointer-events-none truncate px-2 drop-shadow-md">
                                            {track.instrument?.type || "Clip"}
                                        </div>
                                    </div>
                                ))}
                         </div>
                     </div>
                 ))}
                 
                 {/* Playhead */}
                 <div 
                    className={cn(
                        "absolute top-8 bottom-0 w-0.5 bg-cyan-500 z-20 shadow-[0_0_10px_2px_rgba(6,182,212,0.5)] cursor-grab active:cursor-grabbing",
                        draggingPlayhead ? "" : "transition-all duration-75"
                    )}
                    style={{ left: 256 + ((playheadPreview !== null ? playheadPreview : currentBar) * PIXELS_PER_BAR) }}
                    onMouseDown={handlePlayheadMouseDown}
                    title="Drag to scrub timeline"
                 >
                    <div className="absolute -top-1 -left-1.5 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-8 border-t-cyan-500 pointer-events-none"></div>
                 </div>
            </div>
        </div>
    );
}
