import { useEffect, useRef } from 'react';
import * as Tone from 'tone';
import { useAudioStore } from '@/store/useAudioStore';

export function useAudioEngine() {
    const { project, isPlaying, setIsPlaying, setCurrentBar } = useAudioStore();
    const synthsRef = useRef<Map<string, any>>(new Map());
    const channelRef = useRef<Map<string, Tone.Channel>>(new Map());
    const partsRef = useRef<Map<string, Tone.Part<any>>>(new Map());
    const synthTypesRef = useRef<Map<string, string>>(new Map()); // Track types explicitly
    const structureHashRef = useRef<string>("");

    const initAudio = async () => {
        await Tone.start();
        // Set transport loop
        Tone.getTransport().loop = true;
        Tone.getTransport().loopEnd = "128:0:0"; // match timeline max
        console.log('Audio is ready and looping enabled');
    };

    // Sync Project to Audio Engine
    useEffect(() => {
        if (!project) return;

        // 1. Set BPM (Always safe to update)
        if (Tone.getTransport().bpm.value !== project.bpm) {
            Tone.getTransport().bpm.value = project.bpm;
        }

        // 2. Check for Structural Changes (Tracks added/removed, instruments changed, clips changed)
        // We exclude volume/mute from this hash
        const currentStructureHash = JSON.stringify({
            tracks: project.tracks.map(t => ({
                id: t.id,
                type: t.instrument.type, // Instrument type
                clips: t.clips // Note data
            }))
        });

        const structureChanged = currentStructureHash !== structureHashRef.current;

        if (structureChanged) {
            console.log("Structure changed, rebuilding schedule...");
            structureHashRef.current = currentStructureHash;

            // Cancel old schedule
            Tone.getTransport().cancel();

            // Cleanup unused tracks
            const trackIds = new Set(project.tracks.map(t => t.id));

            // Dispose synths, channels, and parts for removed tracks
            synthsRef.current.forEach((synth, id) => {
                if (!trackIds.has(id)) {
                    synth.dispose();
                    synthsRef.current.delete(id);
                }
            });
            channelRef.current.forEach((channel, id) => {
                if (!trackIds.has(id)) {
                    channel.dispose();
                    channelRef.current.delete(id);
                }
            });
            partsRef.current.forEach((part, id) => {
                if (!trackIds.has(id)) {
                    part.dispose();
                    partsRef.current.delete(id);
                }
            });
            synthTypesRef.current.forEach((_, id) => {
                if (!trackIds.has(id)) {
                    synthTypesRef.current.delete(id);
                }
            });
        }

        project.tracks.forEach(track => {
            let synth = synthsRef.current.get(track.id);
            let channel = channelRef.current.get(track.id);

            // A. Create/Ensure Channel
            if (!channel) {
                channel = new Tone.Channel().toDestination();
                channelRef.current.set(track.id, channel);
            }

            // B. Update Parameters (ALWAYS update these)
            // Ramp to value to prevent clicking
            channel.volume.rampTo(Tone.gainToDb(track.volume), 0.1);
            channel.mute = track.muted;

            // C. Create/Ensure Synth
            const type = track.instrument?.type || 'Synth';
            const currentStoredType = synthTypesRef.current.get(track.id);

            // If synth exists but type changed, dispose and recreate
            if (synth && currentStoredType !== type) {
                console.log(`Instrument type changed for track ${track.id} from ${currentStoredType} to ${type}. Recreating...`);
                synth.dispose();
                synth = undefined;
                synthsRef.current.delete(track.id);
                synthTypesRef.current.delete(track.id);
            }

            if (!synth) {
                switch (type) {
                    case 'MembraneSynth': synth = new Tone.PolySynth(Tone.MembraneSynth); break;
                    case 'MetalSynth': synth = new Tone.PolySynth(Tone.MetalSynth); break;
                    case 'FMSynth': synth = new Tone.PolySynth(Tone.FMSynth); break;
                    case 'AMSynth': synth = new Tone.PolySynth(Tone.AMSynth); break;
                    case 'Synth': default: synth = new Tone.PolySynth(Tone.Synth); break;
                }
                synth.connect(channel);
                synthsRef.current.set(track.id, synth);
                synthTypesRef.current.set(track.id, type);
            }

            // D. Schedule Notes (Only if structure changed)
            if (structureChanged) {
                let part = partsRef.current.get(track.id);
                if (!part) {
                    part = new Tone.Part((time, noteValue: any) => {
                        synth.triggerAttackRelease(noteValue.pitch, noteValue.duration, time, noteValue.velocity);
                    }, []).start(0);
                    partsRef.current.set(track.id, part);
                } else {
                    part.clear();
                }

                // Collect and sort all notes chronologically
                const allNotes: { time: number, note: any }[] = [];
                track.clips.forEach(clip => {
                    if (!clip.notes) return;
                    const clipStart = Tone.Time(`${clip.startBar}:0:0`).toSeconds();
                    clip.notes.forEach(note => {
                        const noteStart = Tone.Time(note.startTime).toSeconds();
                        allNotes.push({ time: clipStart + noteStart, note });
                    });
                });

                // Sort notes by time to satisfy Tone.Part's requirement
                allNotes.sort((a, b) => a.time - b.time);

                // Add sorted notes to the part
                allNotes.forEach(({ time, note }) => {
                    part?.add(time, note);
                });
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

    // Update Progress
    useEffect(() => {
        const interval = setInterval(() => {
            if (Tone.getTransport().state === 'started') {
                const position = Tone.getTransport().position.toString().split(':');
                const bars = parseInt(position[0]);
                const beats = parseInt(position[1]);
                const sixteenths = parseFloat(position[2]);
                setCurrentBar(bars + beats / 4 + sixteenths / 16);
            }
        }, 100);
        return () => clearInterval(interval);
    }, [setCurrentBar]);

    return { initAudio };
}

