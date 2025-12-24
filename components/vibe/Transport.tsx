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
        <div className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center gap-4">
                 <div className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
                    VibePod
                 </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="font-mono text-xl w-24 text-center border rounded bg-card p-1">
                    {formatTime(currentBar)}
                </div>
                
                <div className="flex items-center gap-2">
                    <Button 
                        size="icon" 
                        variant={isPlaying ? "secondary" : "default"}
                        className={cn("h-12 w-12 rounded-full", isPlaying ? "bg-amber-500 hover:bg-amber-600" : "bg-green-500 hover:bg-green-600")}
                        onClick={togglePlay}
                    >
                        {isPlaying ? <Pause className="fill-current" /> : <Play className="fill-current ml-1" />}
                    </Button>
                    <Button size="icon" variant="ghost" onClick={stop}>
                        <Square className="h-5 w-5 fill-foreground/50" />
                    </Button>
                </div>

                <div className="flex items-center gap-3 w-48">
                    <span className="text-xs text-muted-foreground font-medium">BPM</span>
                    <Slider 
                        value={[project?.bpm || 120]} 
                        min={60} 
                        max={160} 
                        step={1} 
                        onValueChange={handleBpmChange}
                        className="flex-1"
                    />
                    <span className="text-xs font-mono w-8">{project?.bpm}</span>
                </div>

                <div className="text-[10px] uppercase font-bold text-muted-foreground border px-1 rounded">
                    {audioState}
                </div>
            </div>

            <div className="flex items-center gap-2">
               {/* Export or Save buttons could go here */}
               <Button variant="outline" size="sm" onClick={resetProject}>
                   New Project
               </Button>
            </div>
        </div>
    );
}
