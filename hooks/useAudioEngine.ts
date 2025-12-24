import { useEffect, useRef, useState } from 'react';
import * as Tone from 'tone';
import { useAudioStore } from '@/store/useAudioStore';
import { MOCK_LOOPS } from '@/lib/audioUtils';

export function useAudioEngine() {
    const { project, isPlaying, setIsPlaying, setCurrentBar } = useAudioStore();
    const playersRef = useRef<Map<string, Tone.Player>>(new Map());
    const channelRef = useRef<Map<string, Tone.Channel>>(new Map());
    
    // Initialize Audio Context on user interaction (handled by Play button usually, but we need a start function)
    const initAudio = async () => {
        await Tone.start();
        console.log('Audio is ready');
    };

    // Sync Project to Audio Engine
    useEffect(() => {
        if (!project) return;
        
        // 1. Set BPM
        Tone.Transport.bpm.value = project.bpm;
        
        // 2. Clear old schedule
        Tone.Transport.cancel();
        
        // 3. Setup Tracks
        // Ideally we diff, but for prototype we can rebuild.
        // But rebuilding players is expensive (network). 
        // We will try to reuse players if loopId matches.
        
        project.tracks.forEach(track => {
            let player = playersRef.current.get(track.id);
            let channel = channelRef.current.get(track.id);
            
            // Create Channel (Volume/Pan/Mute/Solo)
            if (!channel) {
                channel = new Tone.Channel().toDestination();
                channelRef.current.set(track.id, channel);
            }
            
            // Update Channel Params
            channel.volume.value = Tone.gainToDb(track.volume);
            channel.mute = track.muted;
            // Pitch is tricky on Player without repitching, usually requires GrainPlayer or playbackRate.
            // Simplified: playbackRate = intervalToFrequencyRatio(semitones)
            const playbackRate = Tone.intervalToFrequencyRatio(track.pitch);
            
            
            // Create/Update Player
            const url = MOCK_LOOPS[track.loopId] || 'https://tonejs.github.io/audio/drum-samples/CR78/snare.mp3'; // Fallback
            
            // If player doesn't exist or url changed (simplified: just check existence)
            if (!player) {
                player = new Tone.Player(url).connect(channel);
                player.loop = true; // Loops usually loop? Or do we trigger them per clip?
                // The prompt says "Clip ... startBar, durationBars".
                // If the clip duration > loop duration, it loops.
                // We'll set loop=true but start/stop it precisely.
                // Actually Tone.Player loop handles the buffer looping.
                playersRef.current.set(track.id, player);
            }
            // Update pitch
            player.playbackRate = playbackRate;

            // Schedule Clips
            track.clips.forEach(clip => {
                Tone.Transport.schedule((time) => {
                    // Start the player
                    if (player?.loaded) {
                        player.start(time, 0, Tone.Time(`${clip.durationBars}m`).toSeconds());
                    }
                }, `${clip.startBar}:0:0`);
                
                // We create a stop event or just rely on the duration argument of start()
                // start(startTime, offset, duration) -> duration handles the stop.
            });
        });
        
    }, [project]); // Dependency on project structure

    // Handling Playback State
    useEffect(() => {
        if (isPlaying) {
            if (Tone.Transport.state !== 'started') {
                 Tone.Transport.start();
            }
        } else {
             if (Tone.Transport.state === 'started') {
                 Tone.Transport.pause();
             }
        }
    }, [isPlaying]);

    // Update Progress
    useEffect(() => {
        const interval = setInterval(() => {
            if (Tone.Transport.state === 'started') {
                // "Bars:Beats:Sixteenths" -> parse to float bars
                const position = Tone.Transport.position.toString().split(':');
                const bars = parseInt(position[0]);
                const beats = parseInt(position[1]);
                const sixteenths = parseFloat(position[2]);
                // Approximation
                setCurrentBar(bars + beats/4 + sixteenths/16);
            }
        }, 100);
        return () => clearInterval(interval);
    }, [setCurrentBar]);

    return { initAudio };
}
