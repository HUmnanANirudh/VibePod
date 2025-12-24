"use client";

import React from 'react';
import { Play, Square, Pause } from 'lucide-react';
import { getContext, start } from 'tone';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useAudioStore } from '@/store/useAudioStore';
import { cn } from '@/lib/utils';

interface TransportProps {
    initAudio: () => Promise<void>;
}

export function Transport({ initAudio }: TransportProps) {
    const { isPlaying, setIsPlaying, project, setProject, currentBar, resetProject } = useAudioStore();
    
    // Format bars:beats:sixteenths
    const formatTime = (totalBars: number) => {
        const bars = Math.floor(totalBars);
        const beats = Math.floor((totalBars - bars) * 4);
        return `${bars}:${beats}`;
    };

    const [audioState, setAudioState] = React.useState<string>('suspended');

    React.useEffect(() => {
        const interval = setInterval(() => {
             setAudioState(getContext().state);
        }, 500);
        return () => clearInterval(interval);
    }, []);

    const togglePlay = async () => {
        await initAudio(); // Ensure context is started
        setIsPlaying(!isPlaying);
    };

    const stop = () => {
        setIsPlaying(false);
        // We might want to reset transport to 0 here (not in store yet, implemented in engine listener?)
        // In a real app we'd command the engine to seek. 
        // For now, pause is fine, or we can add seek action.
    };
    
    const handleBpmChange = (val: number[]) => {
        if (project) {
            setProject({ ...project, bpm: val[0] });
        }
    };

    return (
        <div className="z-50 relative flex items-center justify-between p-4 bg-gradient-to-b from-zinc-800 to-zinc-900 border-b border-white/5 shadow-xl shadow-black/50">
             {/* Brushed Metal Texture Overlay if we had an image, but clean gradients work for 'metallic finesse' */}
            
            <div className="flex items-center gap-4">
                 <div className="text-2xl font-black bg-gradient-to-br from-zinc-100 via-zinc-400 to-zinc-600 bg-clip-text text-transparent drop-shadow-sm tracking-tighter">
                    VIBEPOD
                 </div>
                 <div className="text-[10px] uppercase font-bold text-zinc-500 border border-zinc-700 bg-zinc-900/50 px-2 py-0.5 rounded shadow-inner tracking-widest">
                    {audioState}
                </div>
            </div>

            <div className="flex items-center gap-8">
                {/* Time Display - Looks like a vintage LED or digital readout */}
                <div className="font-mono text-xl w-32 text-center border-2 border-zinc-700 rounded bg-black/80 p-1 text-cyan-500 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] relative overflow-hidden group">
                     {/* Glass Reflection */}
                     <div className="absolute top-0 left-0 right-0 h-[50%] bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
                    {formatTime(currentBar)}
                </div>
                
                {/* Transport Controls - Metallic Buttons */}
                <div className="flex items-center gap-4 bg-zinc-900/50 p-2 rounded-full border border-zinc-700/50 shadow-inner">
                    <Button 
                        size="icon" 
                        variant="default"
                        className={cn(
                            "h-14 w-14 rounded-full border-4 border-zinc-800 shadow-[2px_2px_5px_rgba(0,0,0,0.5),-1px_-1px_2px_rgba(255,255,255,0.1)] transition-all active:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.8)] active:translate-y-0.5",
                            isPlaying 
                                ? "bg-gradient-to-br from-amber-400 to-orange-600 hover:from-amber-500 hover:to-orange-700 text-white" 
                                : "bg-gradient-to-br from-zinc-700 to-zinc-800 hover:from-zinc-600 hover:to-zinc-700 text-zinc-400 hover:text-green-400"
                        )}
                        onClick={togglePlay}
                    >
                        {isPlaying ? <Pause className="fill-current h-6 w-6 filter drop-shadow-md" /> : <Play className="fill-current h-6 w-6 ml-1 filter drop-shadow-md" />}
                    </Button>
                    <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-10 w-10 rounded-full bg-zinc-800 border-2 border-zinc-700 text-zinc-500 hover:text-red-500 hover:bg-zinc-750 shadow-md active:shadow-inner active:translate-y-px"
                        onClick={stop}
                    >
                        <Square className="h-4 w-4 fill-current" />
                    </Button>
                </div>

                <div className="flex items-center gap-4 w-56 bg-zinc-800/30 p-2 rounded-lg border border-zinc-700/50">
                    <span className="text-[10px] text-zinc-500 font-bold tracking-widest">BPM</span>
                    <Slider 
                        value={[project?.bpm || 120]} 
                        min={60} 
                        max={160} 
                        step={1} 
                        onValueChange={handleBpmChange}
                        className="flex-1 [&>.absolute]:bg-zinc-600 [&_span]:bg-gradient-to-b [&_span]:from-zinc-300 [&_span]:to-zinc-500 [&_span]:border-zinc-900" 
                    />
                    <span className="text-xs font-mono w-8 text-zinc-300">{project?.bpm}</span>
                </div>
            </div>

            <div className="flex items-center gap-2">
               <Button 
                 variant="outline" 
                 size="sm" 
                 onClick={resetProject}
                 className="bg-transparent border-zinc-700 text-zinc-400 hover:text-zinc-100 hover:border-zinc-500 hover:bg-zinc-800 transition-colors uppercase text-xs font-bold tracking-wider"
               >
                   New Project
               </Button>
            </div>
        </div>
    );
}
