"use client";

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GoogleLoginModal } from '@/components/vibe/GoogleLoginModal';
import { cn } from '@/lib/utils';
import { useAudioStore } from '@/store/useAudioStore';
import { authClient } from '@/lib/auth-client';
import { Pause, Play, SkipBack, SkipForward, LogOut, Cloud, CloudOff, Loader2 } from 'lucide-react';
import { useState,useEffect } from 'react';
import { getContext, start } from 'tone';

interface TransportProps {
    initAudio: () => Promise<void>;
}

export function Transport({ initAudio }: TransportProps) {
    const { isPlaying, setIsPlaying, project, setProject, currentBar, draggedPlayheadBar, resetProject, seekTo, isSaving, currentProjectId } = useAudioStore();
    const { data: session, isPending } = authClient.useSession();
    
    const formatTime = (totalBars: number) => {
        const bars = Math.floor(totalBars).toString().padStart(2, '0');
        const beats = Math.floor((totalBars % 1) * 4).toString(); 
        const sixteenths = Math.floor(((totalBars % 1) * 4 % 1) * 4).toString();
        return `${bars}:${beats}:${sixteenths}`;
    };

    const [audioState, setAudioState] = useState<string>('suspended');
    const [showLoginModal, setShowLoginModal] = useState(false);

    const isLoggedIn = !!session?.user;
    const user = session?.user;

    useEffect(() => {
        if (!isPending && !session?.user) {
            setShowLoginModal(true);
        }
    }, [isPending, session]);

    const handleLogin = async () => {
        await authClient.signIn.social({
            provider: "google",
            callbackURL: "/",
        });
    };

    const handleLogout = async () => {
        await authClient.signOut();
        setShowLoginModal(true);
    };
    const initials = user?.name
        ? user.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
        : user?.email?.[0]?.toUpperCase() || "U";

    useEffect(() => {
        const interval = setInterval(() => {
             setAudioState(getContext().state);
        }, 500);
        return () => clearInterval(interval);
    }, []);

    const togglePlay = async () => {
        try {
            await start();
            await initAudio();
            if (getContext().state !== 'running') {
                await getContext().resume();
            }
            
            setIsPlaying(!isPlaying);
        } catch (error) {
            console.error('Failed to start audio:', error);
        }
    };

    const stop = () => {
        setIsPlaying(false);
        seekTo(0);
    };

    const skipForward = () => {
        seekTo(Math.min(96, currentBar + 8));
    };

    const skipBackward = () => {
        seekTo(Math.max(0, currentBar - 8));
    };
    
    const handleBpmChange = (val: number[]) => {
        if (project) {
            setProject({ ...project, bpm: val[0] });
        }
    };

    const handleSeek = (val: number[]) => {
        seekTo(val[0]);
    };

    return (
        <div className="z-50 relative flex items-center justify-between p-4 bg-linear-to-b from-zinc-800 to-zinc-900 border-b border-white/5 shadow-xl shadow-black/50">
            <div className="flex items-center gap-4">
                 <div className="text-2xl font-black bg-linear-to-br from-zinc-100 via-zinc-400 to-zinc-600 bg-clip-text text-transparent drop-shadow-sm tracking-tighter">
                    VIBEPOD
                 </div>
                 <div className="text-[10px] uppercase font-bold text-zinc-500 border border-zinc-700 bg-zinc-900/50 px-2 py-0.5 rounded shadow-inner tracking-widest">
                    {audioState}
                </div>
                {/* Auto-save indicator */}
                {currentProjectId && (
                    <div className={cn(
                        "flex items-center gap-1 text-[10px] uppercase font-bold px-2 py-0.5 rounded border shadow-inner tracking-widest transition-all",
                        isSaving 
                            ? "text-amber-400 border-amber-700/50 bg-amber-900/20" 
                            : "text-emerald-400 border-emerald-700/50 bg-emerald-900/20"
                    )}>
                        {isSaving ? (
                            <>
                                <Loader2 className="h-3 w-3 animate-spin" />
                                Saving
                            </>
                        ) : (
                            <>
                                <Cloud className="h-3 w-3" />
                                Saved
                            </>
                        )}
                    </div>
                )}
            </div>

            <div className="flex items-center gap-8">
                <div className="group relative">
                    <div className="font-mono text-xl w-36 text-center border-2 border-zinc-700 rounded bg-black/80 p-1 text-cyan-500 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-[50%] bg-linear-to-b from-white/10 to-transparent pointer-events-none"></div>
                        {formatTime(draggedPlayheadBar !== null ? draggedPlayheadBar : currentBar)}
                    </div>
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-[9px] font-bold text-zinc-500 uppercase tracking-widest pointer-events-none">
                        Transport Position
                    </div>
                </div>
                <div className="flex items-center gap-2 bg-black/40 p-2 rounded-full border border-zinc-700/50 shadow-inner">
                    <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8 rounded-full text-zinc-600 hover:text-white hover:bg-white/10"
                        onClick={skipBackward}
                    >
                        <SkipBack className="h-4 w-4 fill-current" />
                    </Button>

                    <Button 
                        size="icon" 
                        variant="default"
                        className={cn(
                            "h-14 w-14 mx-2 rounded-full border-4 border-zinc-800 shadow-[2px_2px_5px_rgba(0,0,0,0.5),-1px_-1px_2px_rgba(255,255,255,0.1)] transition-all active:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.8)] active:translate-y-0.5 overflow-hidden group",
                            isPlaying 
                                ? "bg-linear-to-br from-amber-400 to-orange-600 hover:from-amber-500 hover:to-orange-700 text-white" 
                                : "bg-linear-to-br from-zinc-700 to-zinc-800 hover:from-zinc-600 hover:to-zinc-700 text-zinc-400 hover:text-green-400"
                        )}
                        onClick={togglePlay}
                    >
                        {isPlaying ? <Pause className="fill-current h-6 w-6" /> : <Play className="fill-current h-6 w-6 ml-1" />}
                    </Button>
                    <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8 rounded-full text-zinc-600 hover:text-white hover:bg-white/10"
                        onClick={skipForward}
                    >
                        <SkipForward className="h-4 w-4 fill-current" />
                    </Button>
                </div>

                <div className="flex items-center gap-4 w-56 bg-zinc-800/30 p-2 rounded-lg border border-zinc-700/50">
                    <span className="text-[10px] text-zinc-500 font-bold tracking-widest">BPM</span>
                    <Slider 
                        value={[project?.bpm || 0]} 
                        min={60} 
                        max={160} 
                        step={1} 
                        onValueChange={handleBpmChange}
                        className="flex-1 [&>.absolute]:bg-zinc-600 [&_span]:bg-linear-to-b [&_span]:from-zinc-300 [&_span]:to-zinc-500 [&_span]:border-zinc-900" 
                    />
                    <span className="text-xs font-mono w-8 text-zinc-300">{project?.bpm}</span>
                </div>
            </div>

            
            <GoogleLoginModal open={!isLoggedIn && showLoginModal} onLogin={handleLogin} />

            <div className="flex items-center gap-4">
               {isLoggedIn && user ? (
                   <div className="flex items-center gap-4">
                        <div className="hidden sm:flex flex-col items-end">
                            <span className="text-xs font-bold text-zinc-300">{user.name}</span>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="relative h-9 w-9 rounded-full ring-2 ring-cyan-500/50 hover:ring-cyan-400 transition-all overflow-hidden">
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage src={user.image || undefined} alt={user.name || "User"} />
                                        <AvatarFallback className="bg-linear-to-br from-cyan-500 to-purple-600 text-white font-bold">{initials}</AvatarFallback>
                                    </Avatar>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 bg-zinc-900 border-zinc-800">
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium text-zinc-100">{user.name}</p>
                                        <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-zinc-800" />
                                <DropdownMenuItem
                                    onClick={handleLogout}
                                    className="text-red-400 focus:bg-red-500/10 focus:text-red-400 cursor-pointer"
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Sign out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                   </div>
               ) : (
                    <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setShowLoginModal(true)}
                        className="text-zinc-400 hover:text-white"
                    >
                        Sign In
                    </Button>
               )}
            </div>
        </div>
    );
}
