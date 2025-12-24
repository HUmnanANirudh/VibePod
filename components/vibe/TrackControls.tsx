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
        <div className="w-64 flex-shrink-0 flex flex-col p-3 border-r bg-card/50 gap-2">
            <div className="flex items-center gap-2 mb-1">
                <div className={cn("w-3 h-8 rounded-full", LOOP_COLORS[track.type] || "bg-gray-500")} />
                <div className="flex-1 overflow-hidden">
                    <h3 className="font-bold text-sm truncate uppercase tracking-wider">{track.type}</h3>
                    <p className="text-xs text-muted-foreground truncate" title={track.loopId}>{track.loopId}</p>
                </div>
            </div>
            
            <div className="flex items-center gap-2">
                <Toggle 
                    size="sm" 
                    pressed={track.muted} 
                    onPressedChange={(m) => updateTrack(track.id, { muted: m })}
                    className="h-7 w-7 p-0 data-[state=on]:bg-red-500/20 data-[state=on]:text-red-500"
                >
                    M
                </Toggle>
                {/* Solo logic requires managing a solo state globally or checking other tracks. 
                    For MVP, let's skip complex Solo logic or implement it later.
                    We will leave the button as a placeholder or simple local toggle that doesn't enforce exclusive solo properly without global awareness 
                    (which we have in store, but requires 'soloed' property on all tracks).
                */}
                
                <Slider 
                    value={[track.volume]}
                    min={0}
                    max={1}
                    step={0.01}
                    onValueChange={(v) => updateTrack(track.id, { volume: v[0] })}
                    className="flex-1"
                />
            </div>
            
             <div className="flex items-center gap-2 text-xs text-muted-foreground">
                 <span>Pitch</span>
                 <Slider 
                    value={[track.pitch]} 
                    min={-12} 
                    max={12} 
                    step={1}
                    onValueChange={(v) => updateTrack(track.id, { pitch: v[0] })} 
                    className="flex-1"
                />
                <span className="w-6 text-right">{track.pitch > 0 ? '+' : ''}{track.pitch}</span>
             </div>
        </div>
    );
}
