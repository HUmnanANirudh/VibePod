import React from 'react';
import { Volume2, MicOff, Music, Mic } from 'lucide-react'; 
// MicOff as Mute icon? Or VolumeX
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { Track } from '@/lib/schema';
import { useAudioStore } from '@/store/useAudioStore';
import { cn } from '@/lib/utils';
import { LOOP_COLORS } from '@/lib/audioUtils';

interface TrackControlsProps {
    track: Track;
}

export function TrackControls({ track }: TrackControlsProps) {
    const { updateTrack } = useAudioStore();

    return (
        <div className="w-64 shrink-0 flex flex-col p-3 border-r border-zinc-800 bg-linear-to-r from-zinc-900 to-zinc-800/50 gap-2 relative group">
            <div className="flex items-center gap-2 mb-1">
                <div className={cn("w-1 h-8 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.2)]", LOOP_COLORS[track.type] || "bg-gray-500")} />
                <div className="flex-1 overflow-hidden">
                    <div className="flex items-center gap-2">
                        <h3 className="font-bold text-xs truncate uppercase tracking-widest text-zinc-400 group-hover:text-zinc-200 transition-colors">{track.type}</h3>
                        {track.effects && track.effects.length > 0 && (
                            <span className="text-[8px] bg-cyan-500/20 text-cyan-400 px-1 rounded border border-cyan-500/30 font-bold animate-pulse">FX</span>
                        )}
                    </div>
                    <p className="text-[10px] text-zinc-600 truncate font-mono" title={track.instrument?.type}>{track.instrument?.type}</p>
                </div>
            </div>
            
            <div className="flex items-center gap-2">
                <Toggle 
                    size="sm" 
                    pressed={track.muted} 
                    onPressedChange={(m) => updateTrack(track.id, { muted: m })}
                    className="h-6 w-6 p-0 rounded-sm bg-zinc-800 border border-zinc-700 data-[state=on]:bg-red-500/20 data-[state=on]:border-red-500 data-[state=on]:text-red-500 text-zinc-500 hover:text-zinc-300 transition-all shadow-sm"
                >
                    <span className="text-[10px] font-bold">M</span>
                </Toggle>
                
                <Slider 
                    value={[track.volume]}
                    min={0}
                    max={1}
                    step={0.01}
                    onValueChange={(v) => updateTrack(track.id, { volume: v[0] })}
                    className="flex-1 [&>.absolute]:bg-zinc-700 [&_span]:bg-zinc-400 [&_span]:border-zinc-800"
                />
            </div>
        </div>
    );
}
