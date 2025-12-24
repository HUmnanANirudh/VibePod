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
        <div className="w-64 flex-shrink-0 flex flex-col p-3 border-r border-zinc-800 bg-gradient-to-r from-zinc-900 to-zinc-800/50 gap-2 relative group">
            <div className="flex items-center gap-2 mb-1">
                <div className={cn("w-1 h-8 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.2)]", LOOP_COLORS[track.type] || "bg-gray-500")} />
                <div className="flex-1 overflow-hidden">
                    <h3 className="font-bold text-xs truncate uppercase tracking-widest text-zinc-400 group-hover:text-zinc-200 transition-colors">{track.type}</h3>
                    <p className="text-[10px] text-zinc-600 truncate font-mono" title={track.loopId}>{track.loopId}</p>
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
            
             <div className="flex items-center gap-2 text-[10px] text-zinc-600 font-mono">
                 <span>PITCH</span>
                 <Slider 
                    value={[track.pitch]} 
                    min={-12} 
                    max={12} 
                    step={1}
                    onValueChange={(v) => updateTrack(track.id, { pitch: v[0] })} 
                    className="flex-1 [&>.absolute]:bg-zinc-700 [&_span]:h-3 [&_span]:w-3 [&_span]:bg-zinc-500"
                />
                <span className="w-6 text-right text-zinc-400">{track.pitch > 0 ? '+' : ''}{track.pitch}</span>
             </div>
        </div>
    );
}
