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
    const structureHashRef = useRef<string>("");
    const masterChainRef = useRef<{ limiter: Tone.Limiter, compressor: Tone.Compressor, gain: Tone.Gain } | null>(null);
    const sidechainRef = useRef<Tone.Compressor | null>(null);

    const initAudio = async () => {
        await Tone.start();

        // Initialize Master Chain - v12: More headroom for 5-7 track arrangements
        if (!masterChainRef.current) {
            const gain = new Tone.Gain(0.5).toDestination(); // -6dB master headroom (was 0.7)
            const limiter = new Tone.Limiter(-0.5).connect(gain); // Lower threshold
            const compressor = new Tone.Compressor({
                threshold: -18,  // Lower threshold for more tracks
                ratio: 3,        // Higher ratio
                attack: 0.003,
                release: 0.25
            }).connect(limiter);
            masterChainRef.current = { limiter, compressor, gain };
        }

        Tone.getTransport().loop = true;
        Tone.getTransport().loopEnd = "128:0:0";

        // Add swing for human feel (v12)
        Tone.getTransport().swing = 0.15;
        Tone.getTransport().swingSubdivision = '8n';

        console.log('Audio Engine Ready v12 (Presets + Sidechain + Swing)');

    };

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
        if (isPlaying) {
            if (Tone.getTransport().state !== 'started') {
                Tone.getTransport().start();
            }
        } else {
            if (Tone.getTransport().state === 'started') {
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
        
        const updatePlayhead = (timestamp: number) => {
            // Throttle updates to reduce re-renders
            if (timestamp - lastUpdate >= throttleMs) {
                if (Tone.getTransport().state === 'started') {
                    const position = Tone.getTransport().position.toString().split(':');
                    const bars = parseInt(position[0]);
                    const beats = parseInt(position[1]);
                    const sixteenths = parseFloat(position[2]);
                    setCurrentBar(bars + beats / 4 + sixteenths / 16);
                }
                lastUpdate = timestamp;
            }
            animationFrameId = requestAnimationFrame(updatePlayhead);
        };
        
        animationFrameId = requestAnimationFrame(updatePlayhead);
        
        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [setCurrentBar]);

    return { initAudio };
}

