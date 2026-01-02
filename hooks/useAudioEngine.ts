import { useEffect, useRef } from 'react';
import * as Tone from 'tone';
import { useAudioStore } from '@/store/useAudioStore';
import { getPreset } from '@/lib/audioPresets';
import { snapToScale } from '@/lib/musicUtils';

export function useAudioEngine() {
    const { project, isPlaying, setIsPlaying, setCurrentBar } = useAudioStore();
    const synthsRef = useRef<Map<string, any>>(new Map());
    const channelRef = useRef<Map<string, Tone.Channel>>(new Map());
    const effectsRef = useRef<Map<string, Tone.ToneAudioNode[]>>(new Map()); // Manage effect chains
    const partsRef = useRef<Map<string, Tone.Part<any>>>(new Map());
    const synthTypesRef = useRef<Map<string, string>>(new Map());
    const recorderRef = useRef<Tone.Recorder | null>(null);
    const structureHashRef = useRef<string>("");
    const masterChainRef = useRef<{ limiter: Tone.Limiter, compressor: Tone.Compressor, gain: Tone.Gain, speakerGain: Tone.Gain } | null>(null);
    const sidechainRef = useRef<Tone.Compressor | null>(null);

    const initAudio = async () => {
        await Tone.start();

        // Initialize Master Chain - v12: More headroom for 5-7 track arrangements
        if (!masterChainRef.current) {
            // Recording gain (before speaker output)
            const recordGain = new Tone.Gain(0.5);
            
            // Speaker output gain (can be muted during export)
            const speakerGain = new Tone.Gain(1).toDestination();
            recordGain.connect(speakerGain);
            
            const limiter = new Tone.Limiter(-0.5).connect(recordGain);
            const compressor = new Tone.Compressor({
                threshold: -18,
                ratio: 3,
                attack: 0.003,
                release: 0.25
            }).connect(limiter);
            
            masterChainRef.current = { limiter, compressor, gain: recordGain, speakerGain };

            // Initialize Recorder - connected to recordGain (before speaker mute)
            recorderRef.current = new Tone.Recorder();
            recordGain.connect(recorderRef.current);
        }

        Tone.getTransport().loop = true;
        Tone.getTransport().loopEnd = "128:0:0";

        // Add swing for human feel (v12)
        Tone.getTransport().swing = 0.15;
        Tone.getTransport().swingSubdivision = '8n';

        console.log('Audio Engine Ready v12 (Presets + Sidechain + Swing)');

    };

    // ... (rest of effects)

    const startRecording = async () => {
        if (recorderRef.current && recorderRef.current.state !== 'started') {
            await recorderRef.current.start();
            console.log("Recording started");
        }
    };

    const stopRecording = async () => {
        if (recorderRef.current && recorderRef.current.state === 'started') {
            const recording = await recorderRef.current.stop();
            const url = URL.createObjectURL(recording);
            const anchor = document.createElement("a");
            anchor.download = "vibepod-track.webm";
            anchor.href = url;
            anchor.click();
            console.log("Recording stopped and downloaded");
            return url;
        }
        return null;
    };

    const isExportingRef = useRef(false);

    const renderAudio = async (onProgress?: (percent: number) => void) => {
        // Mark as exporting FIRST to prevent playback effect interference
        isExportingRef.current = true;
        
        // Ensure audio is initialized
        if (!recorderRef.current || !masterChainRef.current) {
            console.log("Initializing audio for export...");
            await initAudio();
        }
        
        if (!recorderRef.current || !masterChainRef.current) {
            console.error("Failed to initialize audio for export");
            isExportingRef.current = false;
            return;
        }
        
        const { project, setIsPlaying, setCurrentBar } = useAudioStore.getState();
        if (!project || project.tracks.length === 0) {
            console.warn("No project to render");
            return;
        }

        // Calculate actual project duration based on clips
        let maxBar = 0;
        project.tracks.forEach(track => {
            track.clips.forEach(clip => {
                const clipEnd = clip.startBar + clip.durationBars;
                if (clipEnd > maxBar) {
                    maxBar = clipEnd;
                }
            });
        });

        if (maxBar === 0) {
            console.warn("No clips to render");
            return;
        }

        // Add 1 bar buffer for tail/reverb
        maxBar += 1;

        const bpm = project.bpm || 120;
        const secondsPerBar = 60 / bpm * 4; // 4 beats per bar
        const durationSeconds = maxBar * secondsPerBar;

        console.log(`Rendering ${maxBar} bars at ${bpm} BPM = ${durationSeconds.toFixed(1)} seconds (silent export)`);

        // Stop current playback and sync state
        setIsPlaying(false);
        if (Tone.getTransport().state === 'started') {
            Tone.getTransport().stop();
        }

        // Mute speaker output during export (recording still captures audio)
        let originalSpeakerGain = 1;
        if (masterChainRef.current?.speakerGain) {
            originalSpeakerGain = masterChainRef.current.speakerGain.gain.value;
            masterChainRef.current.speakerGain.gain.value = 0;
        }

        // Start recording
        console.log("Starting recorder...");
        try {
            // Ensure audio context is running
            if (Tone.getContext().state !== 'running') {
                console.log("Resuming audio context...");
                await Tone.getContext().resume();
            }
            
            // Stop any existing recording first
            if (recorderRef.current.state === 'started') {
                console.log("Stopping existing recording...");
                await recorderRef.current.stop();
            }
            
            console.log(`Recorder state before start: ${recorderRef.current.state}`);
            recorderRef.current.start();
            console.log("Recorder started successfully");
        } catch (err) {
            console.error("Failed to start recorder:", err);
            isExportingRef.current = false;
            if (masterChainRef.current?.speakerGain) {
                masterChainRef.current.speakerGain.gain.value = originalSpeakerGain;
            }
            return;
        }
        
        Tone.getTransport().position = 0;
        
        // Temporarily disable loop for export
        const wasLooping = Tone.getTransport().loop;
        Tone.getTransport().loop = false;
        
        console.log("Starting transport for export...");
        Tone.getTransport().start();
        console.log(`Export started, will take ${durationSeconds.toFixed(1)} seconds`);

        // Progress updates
        const startTime = Date.now();
        const progressInterval = setInterval(() => {
            const elapsed = (Date.now() - startTime) / 1000;
            const percent = Math.min((elapsed / durationSeconds) * 100, 99);
            console.log(`Export progress: ${percent.toFixed(0)}%`);
            onProgress?.(percent);
        }, 500); // Update every 500ms for less spam

        return new Promise<void>((resolve) => {
            setTimeout(async () => {
                clearInterval(progressInterval);
                onProgress?.(100);
                
                Tone.getTransport().stop();
                Tone.getTransport().loop = wasLooping; // Restore loop state
                Tone.getTransport().position = 0; // Reset position
                
                // Restore speaker volume
                if (masterChainRef.current?.speakerGain) {
                    masterChainRef.current.speakerGain.gain.value = originalSpeakerGain;
                }
                
                // Sync store state
                setCurrentBar(0);
                setIsPlaying(false);
                isExportingRef.current = false;
                
                if (recorderRef.current && recorderRef.current.state === 'started') {
                    const recording = await recorderRef.current.stop();
                    const url = URL.createObjectURL(recording);
                    const anchor = document.createElement("a");
                    anchor.download = `vibepod-${Date.now()}.webm`;
                    anchor.href = url;
                    anchor.click();
                    URL.revokeObjectURL(url);
                }
                resolve();
            }, durationSeconds * 1000 + 300);
        });
    };

    // Sync Project to Audio Engine
    // ... (previous implementation)

    // ... (rest of existing code)

    // Continued...


    // Sync Project to Audio Engine
    useEffect(() => {
        if (!project) return;

        // 1. Set BPM
        if (Tone.getTransport().bpm.value !== project.bpm) {
            Tone.getTransport().bpm.value = project.bpm;
        }

        // 2. Calculate project length and set loop
        let maxBar = 16; // default
        project.tracks.forEach(track => {
            track.clips.forEach(clip => {
                const clipEnd = clip.startBar + clip.durationBars;
                if (clipEnd > maxBar) {
                    maxBar = clipEnd;
                }
            });
        });

        // Set transport loop with proper end point
        Tone.getTransport().loop = true;
        Tone.getTransport().loopStart = 0;
        Tone.getTransport().loopEnd = `${maxBar}:0:0`;
        console.log(`Transport loop: 0 to ${maxBar} bars`);

        // 3. Structural Check
        const currentStructureHash = JSON.stringify({
            tracks: project.tracks.map(t => ({
                id: t.id,
                instr: t.instrument,
                fx: t.effects, // FX included in hash
                clips: t.clips
            }))
        });

        const structureChanged = currentStructureHash !== structureHashRef.current;

        if (structureChanged) {
            console.log("Structure/FX changed, rebuilding signal chain...");
            structureHashRef.current = currentStructureHash;
            Tone.getTransport().cancel();

            // Cleanup tracks that are no longer in the project
            const activeTrackIds = new Set(project.tracks.map(t => t.id));
            synthsRef.current.forEach((synth, id) => {
                if (!activeTrackIds.has(id)) {
                    console.log(`Disposing track ${id}...`);
                    synth.dispose(); synthsRef.current.delete(id);
                    channelRef.current.get(id)?.dispose(); channelRef.current.delete(id);
                    partsRef.current.get(id)?.dispose(); partsRef.current.delete(id);
                    effectsRef.current.get(id)?.forEach(fx => fx.dispose()); effectsRef.current.delete(id);
                    synthTypesRef.current.delete(id);
                }
            });
        }

        project.tracks.forEach(track => {
            let synth = synthsRef.current.get(track.id);
            let channel = channelRef.current.get(track.id);
            let currentFxChain = effectsRef.current.get(track.id) || [];

            // A. Create/Ensure Channel
            if (!channel) {
                // Connect to master chain instead of direct toDestination
                channel = new Tone.Channel();
                if (masterChainRef.current) {
                    channel.connect(masterChainRef.current.compressor);
                } else {
                    channel.toDestination();
                }
                channelRef.current.set(track.id, channel);
            }
            // Add MORE headroom at track level for 5-7 track arrangements (v12)
            const scaledVolume = track.volume * 0.65;  // Was 0.8, now 0.65 for more tracks
            channel.volume.rampTo(Tone.gainToDb(scaledVolume), 0.1);
            channel.mute = track.muted;

            // B. Rebuild Signal Chain if structure changed
            if (structureChanged) {
                // Dispose old FX
                currentFxChain.forEach(node => node.dispose());
                currentFxChain = [];

                // Create new FX Nodes
                track.effects?.forEach(fx => {
                    let node: any;
                    switch (fx.type) {
                        // Original effects
                        case 'Distortion': node = new Tone.Distortion(fx.options?.distortion || 0.4); break;
                        case 'Reverb': node = new Tone.Reverb({ decay: fx.options?.decay || 2 }); break;
                        case 'Chorus': node = new Tone.Chorus(4, 2.5, 0.5); break;
                        case 'FeedbackDelay': node = new Tone.FeedbackDelay(fx.options?.delayTime || "8n", 0.5); break;
                        case 'Phaser': node = new Tone.Phaser({ frequency: 15, octaves: 5, baseFrequency: 1000 }); break;
                        case 'BitCrusher': node = new Tone.BitCrusher(fx.options?.bits || 4); break;

                        // New effects (Full Tone.js library)
                        case 'AutoFilter':
                            node = new Tone.AutoFilter("4n");
                            node.start(); // Start the LFO
                            break;
                        case 'AutoWah': node = new Tone.AutoWah(50, 6, -30); break;
                        case 'Tremolo':
                            node = new Tone.Tremolo(9, 0.75);
                            node.start(); // Start the LFO
                            break;
                        case 'Vibrato':
                            node = new Tone.Vibrato(5, 0.1);
                            break;
                        case 'PingPongDelay': node = new Tone.PingPongDelay(fx.options?.delayTime || "8n", 0.3); break;
                        case 'JCReverb': node = new Tone.JCReverb(0.4); break;
                        case 'Freeverb': node = new Tone.Freeverb(); break;
                        case 'PitchShift': node = new Tone.PitchShift(fx.options?.pitch || 0); break;
                        case 'Chebyshev': node = new Tone.Chebyshev(50); break;
                        case 'StereoWidener': node = new Tone.StereoWidener(0.5); break;
                        case 'AutoPanner':
                            node = new Tone.AutoPanner("4n");
                            node.start(); // Start the LFO
                            break;
                        case 'FrequencyShifter': node = new Tone.FrequencyShifter(42); break;

                        default:
                            console.warn(`Unknown effect type: ${fx.type}`);
                            return;
                    }
                    if (node) {
                        node.wet.value = fx.wet;
                        currentFxChain.push(node);
                        console.log(`✓ Added ${fx.type} (wet: ${fx.wet}) to track ${track.id}`);
                    }
                });
                effectsRef.current.set(track.id, currentFxChain);

                // Recreate Synth if needed or just re-connect
                const type = track.instrument?.type || 'Synth';
                const currentStoredType = synthTypesRef.current.get(track.id);

                if (synth && (currentStoredType !== type)) {
                    synth.dispose();
                    synth = undefined;
                }

                if (!synth) {
                    // v12: Use professional presets instead of AI options
                    const preset = getPreset(track.type, type);
                    const synthClass = (Tone as any)[type] || Tone.Synth;

                    try {
                        if (preset) {
                            synth = new Tone.PolySynth(synthClass, preset);
                            console.log(`✓ Applied ${track.type}/${type} preset`);
                        } else {
                            synth = new Tone.PolySynth(synthClass);
                            console.warn(`No preset for ${track.type}/${type}, using defaults`);
                        }
                    } catch (error) {
                        console.warn(`Failed to create ${type}:`, error);
                        synth = new Tone.PolySynth(Tone.Synth);
                    }

                    // Connect chain: Synth -> FX1 -> FX2 -> ... -> Channel
                    let lastNode: Tone.ToneAudioNode = synth;
                    currentFxChain.forEach(fxNode => {
                        lastNode.disconnect();
                        lastNode.connect(fxNode);
                        lastNode = fxNode;
                    });
                    lastNode.disconnect();
                    lastNode.connect(channel);

                    synthsRef.current.set(track.id, synth);
                    synthTypesRef.current.set(track.id, type);
                    console.log(`✓ Created ${type} for track ${track.id}, connected to master chain`);
                } else {
                    // Just reconnect
                    let lastNode: Tone.ToneAudioNode = synth;
                    currentFxChain.forEach(fxNode => {
                        lastNode.disconnect();
                        lastNode.connect(fxNode);
                        lastNode = fxNode;
                    });
                    lastNode.disconnect();
                    lastNode.connect(channel);
                }

                // C. Schedule Notes
                let part = partsRef.current.get(track.id);
                if (part) part.dispose();

                part = new Tone.Part((time, noteValue: any) => {
                    synth.triggerAttackRelease(noteValue.pitch, noteValue.duration, time, noteValue.velocity);
                }, []).start(0);
                partsRef.current.set(track.id, part);

                const allNotes: { time: number, note: any }[] = [];
                track.clips.forEach(clip => {
                    const clipStart = Tone.Time(`${clip.startBar}:0:0`).toSeconds();
                    clip.notes?.forEach(note => {
                        const noteStart = Tone.Time(note.startTime).toSeconds();

                        // v12: Snap notes to scale for melodic tracks
                        let correctedPitch = note.pitch;
                        if (track.type !== 'drums') {
                            correctedPitch = snapToScale(note.pitch, 'C2', 'minor');
                        }

                        allNotes.push({
                            time: clipStart + noteStart,
                            note: { ...note, pitch: correctedPitch }
                        });
                    });
                });
                allNotes.sort((a, b) => a.time - b.time);
                allNotes.forEach(({ time, note }) => part?.add(time, note));

                console.log(`✓ Scheduled ${allNotes.length} notes for track ${track.id}`);
            }
        });

    }, [project]);

    // Handling Playback State
    useEffect(() => {
        // Skip if we're exporting - export controls transport directly
        if (isExportingRef.current) {
            console.log(`Playback effect skipped (exporting)`);
            return;
        }
        
        console.log(`Playback state changed: isPlaying=${isPlaying}, transport=${Tone.getTransport().state}`);
        if (isPlaying) {
            if (Tone.getTransport().state !== 'started') {
                console.log('Starting transport...');
                Tone.getTransport().start();
            }
        } else {
            if (Tone.getTransport().state === 'started') {
                console.log('Pausing transport...');
                Tone.getTransport().pause();
            }
        }
    }, [isPlaying]);

    // Handling Seek Requests
    const { seekRequest } = useAudioStore();
    const lastSeekTimestamp = useRef<number>(0);

    useEffect(() => {
        if (seekRequest && seekRequest.timestamp > lastSeekTimestamp.current) {
            lastSeekTimestamp.current = seekRequest.timestamp;
            Tone.getTransport().position = `${seekRequest.bar}:0:0`;
            console.log(`Seeked to bar: ${seekRequest.bar}`);
        }
    }, [seekRequest]);

    // Update Progress with optimized animation frame
    useEffect(() => {
        let animationFrameId: number;
        let lastUpdate = 0;
        const throttleMs = 16; // ~60fps
        let frameCount = 0;

        const updatePlayhead = (timestamp: number) => {
            // Throttle updates to reduce re-renders
            if (timestamp - lastUpdate >= throttleMs) {
                const transportState = Tone.getTransport().state;
                if (transportState === 'started') {
                    const position = Tone.getTransport().position.toString().split(':');
                    const bars = parseInt(position[0]);
                    const beats = parseInt(position[1]);
                    const sixteenths = parseFloat(position[2]);
                    const currentPos = bars + beats / 4 + sixteenths / 16;
                    useAudioStore.getState().setCurrentBar(currentPos);
                    
                    // Log every 60 frames (~1 second)
                    frameCount++;
                    if (frameCount % 60 === 0) {
                        console.log(`Playhead: bar ${currentPos.toFixed(2)}, transport: ${transportState}`);
                    }
                }
                lastUpdate = timestamp;
            }
            animationFrameId = requestAnimationFrame(updatePlayhead);
        };

        console.log('Starting playhead animation frame');
        animationFrameId = requestAnimationFrame(updatePlayhead);

        return () => {
            console.log('Stopping playhead animation frame');
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, []); // Empty deps - runs once, uses getState() for updates

    return { initAudio, startRecording, stopRecording, renderAudio };
}

