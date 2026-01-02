import { useEffect, useRef } from "react";
import * as Tone from "tone";
import { useAudioStore } from "@/store/useAudioStore";
import { getPreset } from "@/lib/audioPresets";
import { snapToScale } from "@/lib/musicUtils";

export function useAudioEngine() {
  const { project, isPlaying, setIsPlaying, setCurrentBar } = useAudioStore();
  const synthsRef = useRef<Map<string, any>>(new Map());
  const channelRef = useRef<Map<string, Tone.Channel>>(new Map());
  const effectsRef = useRef<Map<string, Tone.ToneAudioNode[]>>(new Map());
  const partsRef = useRef<Map<string, Tone.Part<any>>>(new Map());
  const synthTypesRef = useRef<Map<string, string>>(new Map());
  const recorderRef = useRef<Tone.Recorder | null>(null);
  const structureHashRef = useRef<string>("");
  const masterChainRef = useRef<{
    limiter: Tone.Limiter;
    compressor: Tone.Compressor;
    gain: Tone.Gain;
    speakerGain: Tone.Gain;
  } | null>(null);

  const initAudio = async () => {
    await Tone.start();

    if (!masterChainRef.current) {
      const recordGain = new Tone.Gain(0.5);

      const speakerGain = new Tone.Gain(1).toDestination();
      recordGain.connect(speakerGain);

      const limiter = new Tone.Limiter(-0.5).connect(recordGain);
      const compressor = new Tone.Compressor({
        threshold: -18,
        ratio: 3,
        attack: 0.003,
        release: 0.25,
      }).connect(limiter);

      masterChainRef.current = {
        limiter,
        compressor,
        gain: recordGain,
        speakerGain,
      };

      recorderRef.current = new Tone.Recorder();
      recordGain.connect(recorderRef.current);
    }

    Tone.getTransport().loop = true;
    Tone.getTransport().loopEnd = "128:0:0";

    Tone.getTransport().swing = 0.15;
    Tone.getTransport().swingSubdivision = "8n";
  };

  const startRecording = async () => {
    if (recorderRef.current && recorderRef.current.state !== "started") {
      await recorderRef.current.start();
    }
  };

  const stopRecording = async () => {
    if (recorderRef.current && recorderRef.current.state === "started") {
      const recording = await recorderRef.current.stop();
      const url = URL.createObjectURL(recording);
      const anchor = document.createElement("a");
      anchor.download = "vibepod-track.webm";
      anchor.href = url;
      anchor.click();
      return url;
    }
    return null;
  };

  const isExportingRef = useRef(false);

  const renderAudio = async (onProgress?: (percent: number) => void) => {
    isExportingRef.current = true;

    if (!recorderRef.current || !masterChainRef.current) {
      await initAudio();
    }

    if (!recorderRef.current || !masterChainRef.current) {
      isExportingRef.current = false;
      return;
    }

    const { project, setIsPlaying, setCurrentBar } = useAudioStore.getState();
    if (!project || project.tracks.length === 0) {
      return;
    }
    let maxBar = 0;
    project.tracks.forEach((track) => {
      track.clips.forEach((clip) => {
        const clipEnd = clip.startBar + clip.durationBars;
        if (clipEnd > maxBar) {
          maxBar = clipEnd;
        }
      });
    });

    if (maxBar === 0) {
      return;
    }
    maxBar += 1;

    const bpm = project.bpm || 120;
    const secondsPerBar = (60 / bpm) * 4;
    const durationSeconds = maxBar * secondsPerBar;

    setIsPlaying(false);
    if (Tone.getTransport().state === "started") {
      Tone.getTransport().stop();
    }

    let originalSpeakerGain = 1;
    if (masterChainRef.current?.speakerGain) {
      originalSpeakerGain = masterChainRef.current.speakerGain.gain.value;
      masterChainRef.current.speakerGain.gain.value = 0;
    }

    try {
      if (Tone.getContext().state !== "running") {
        await Tone.getContext().resume();
      }

      if (recorderRef.current.state === "started") {
        await recorderRef.current.stop();
      }

      recorderRef.current.start();
    } catch (err) {
      isExportingRef.current = false;
      if (masterChainRef.current?.speakerGain) {
        masterChainRef.current.speakerGain.gain.value = originalSpeakerGain;
      }
      return;
    }

    Tone.getTransport().position = 0;

    const wasLooping = Tone.getTransport().loop;
    Tone.getTransport().loop = false;

    Tone.getTransport().start();

    const startTime = Date.now();
    const progressInterval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const percent = Math.min((elapsed / durationSeconds) * 100, 99);
      onProgress?.(percent);
    }, 500);

    return new Promise<void>((resolve) => {
      setTimeout(async () => {
        clearInterval(progressInterval);
        onProgress?.(100);

        Tone.getTransport().stop();
        Tone.getTransport().loop = wasLooping;
        Tone.getTransport().position = 0;

        if (masterChainRef.current?.speakerGain) {
          masterChainRef.current.speakerGain.gain.value = originalSpeakerGain;
        }

        setCurrentBar(0);
        setIsPlaying(false);
        isExportingRef.current = false;

        if (recorderRef.current && recorderRef.current.state === "started") {
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

  useEffect(() => {
    if (!project) return;
    if (Tone.getTransport().bpm.value !== project.bpm) {
      Tone.getTransport().bpm.value = project.bpm;
    }

    let maxBar = 16;
    project.tracks.forEach((track) => {
      track.clips.forEach((clip) => {
        const clipEnd = clip.startBar + clip.durationBars;
        if (clipEnd > maxBar) {
          maxBar = clipEnd;
        }
      });
    });

    Tone.getTransport().loop = true;
    Tone.getTransport().loopStart = 0;
    Tone.getTransport().loopEnd = `${maxBar}:0:0`;

    const currentStructureHash = JSON.stringify({
      tracks: project.tracks.map((t) => ({
        id: t.id,
        instr: t.instrument,
        fx: t.effects,
        clips: t.clips,
      })),
    });

    const structureChanged = currentStructureHash !== structureHashRef.current;

    if (structureChanged) {
      structureHashRef.current = currentStructureHash;
      Tone.getTransport().cancel();
      const activeTrackIds = new Set(project.tracks.map((t) => t.id));
      synthsRef.current.forEach((synth, id) => {
        if (!activeTrackIds.has(id)) {
          synth.dispose();
          synthsRef.current.delete(id);
          channelRef.current.get(id)?.dispose();
          channelRef.current.delete(id);
          partsRef.current.get(id)?.dispose();
          partsRef.current.delete(id);
          effectsRef.current.get(id)?.forEach((fx) => fx.dispose());
          effectsRef.current.delete(id);
          synthTypesRef.current.delete(id);
        }
      });
    }

    project.tracks.forEach((track) => {
      let synth = synthsRef.current.get(track.id);
      let channel = channelRef.current.get(track.id);
      let currentFxChain = effectsRef.current.get(track.id) || [];
      if (!channel) {
        channel = new Tone.Channel();
        if (masterChainRef.current) {
          channel.connect(masterChainRef.current.compressor);
        } else {
          channel.toDestination();
        }
        channelRef.current.set(track.id, channel);
      }
      const scaledVolume = track.volume * 0.65;
      channel.volume.rampTo(Tone.gainToDb(scaledVolume), 0.1);
      channel.mute = track.muted;

      if (structureChanged) {
        currentFxChain.forEach((node) => node.dispose());
        currentFxChain = [];

        track.effects?.forEach((fx) => {
          let node: any;
          switch (fx.type) {
            case "Distortion":
              node = new Tone.Distortion(fx.options?.distortion || 0.4);
              break;
            case "Reverb":
              node = new Tone.Reverb({ decay: fx.options?.decay || 2 });
              break;
            case "Chorus":
              node = new Tone.Chorus(4, 2.5, 0.5);
              break;
            case "FeedbackDelay":
              node = new Tone.FeedbackDelay(fx.options?.delayTime || "8n", 0.5);
              break;
            case "Phaser":
              node = new Tone.Phaser({
                frequency: 15,
                octaves: 5,
                baseFrequency: 1000,
              });
              break;
            case "BitCrusher":
              node = new Tone.BitCrusher(fx.options?.bits || 4);
              break;
            case "AutoFilter":
              node = new Tone.AutoFilter("4n");
              node.start(); 
              break;
            case "AutoWah":
              node = new Tone.AutoWah(50, 6, -30);
              break;
            case "Tremolo":
              node = new Tone.Tremolo(9, 0.75);
              node.start(); 
              break;
            case "Vibrato":
              node = new Tone.Vibrato(5, 0.1);
              break;
            case "PingPongDelay":
              node = new Tone.PingPongDelay(fx.options?.delayTime || "8n", 0.3);
              break;
            case "JCReverb":
              node = new Tone.JCReverb(0.4);
              break;
            case "Freeverb":
              node = new Tone.Freeverb();
              break;
            case "PitchShift":
              node = new Tone.PitchShift(fx.options?.pitch || 0);
              break;
            case "Chebyshev":
              node = new Tone.Chebyshev(50);
              break;
            case "StereoWidener":
              node = new Tone.StereoWidener(0.5);
              break;
            case "AutoPanner":
              node = new Tone.AutoPanner("4n");
              node.start(); 
              break;
            case "FrequencyShifter":
              node = new Tone.FrequencyShifter(42);
              break;

            default:
              return;
          }
          if (node) {
            node.wet.value = fx.wet;
            currentFxChain.push(node);
          }
        });
        effectsRef.current.set(track.id, currentFxChain);

        const type = track.instrument?.type || "Synth";
        const currentStoredType = synthTypesRef.current.get(track.id);

        if (synth && currentStoredType !== type) {
          synth.dispose();
          synth = undefined;
        }

        if (!synth) {
          const preset = getPreset(track.type, type);
          const synthClass = (Tone as any)[type] || Tone.Synth;

          try {
            if (preset) {
              synth = new Tone.PolySynth(synthClass, preset);
            } else {
              synth = new Tone.PolySynth(synthClass);
            }
          } catch (error) {
            synth = new Tone.PolySynth(Tone.Synth);
          }
          let lastNode: Tone.ToneAudioNode = synth;
          currentFxChain.forEach((fxNode) => {
            lastNode.disconnect();
            lastNode.connect(fxNode);
            lastNode = fxNode;
          });
          lastNode.disconnect();
          lastNode.connect(channel);

          synthsRef.current.set(track.id, synth);
          synthTypesRef.current.set(track.id, type);
        } else {
          let lastNode: Tone.ToneAudioNode = synth;
          currentFxChain.forEach((fxNode) => {
            lastNode.disconnect();
            lastNode.connect(fxNode);
            lastNode = fxNode;
          });
          lastNode.disconnect();
          lastNode.connect(channel);
        }
        let part = partsRef.current.get(track.id);
        if (part) part.dispose();

        part = new Tone.Part((time, noteValue: any) => {
          synth.triggerAttackRelease(
            noteValue.pitch,
            noteValue.duration,
            time,
            noteValue.velocity
          );
        }, []).start(0);
        partsRef.current.set(track.id, part);

        const allNotes: { time: number; note: any }[] = [];
        track.clips.forEach((clip) => {
          const clipStart = Tone.Time(`${clip.startBar}:0:0`).toSeconds();
          clip.notes?.forEach((note) => {
            const noteStart = Tone.Time(note.startTime).toSeconds();
            let correctedPitch = note.pitch;
            if (track.type !== "drums") {
              correctedPitch = snapToScale(note.pitch, "C2", "minor");
            }

            allNotes.push({
              time: clipStart + noteStart,
              note: { ...note, pitch: correctedPitch },
            });
          });
        });
        allNotes.sort((a, b) => a.time - b.time);
        allNotes.forEach(({ time, note }) => part?.add(time, note));
      }
    });
  }, [project]);
  useEffect(() => {
    if (isExportingRef.current) {
      return;
    }

    if (isPlaying) {
      if (Tone.getTransport().state !== "started") {
        Tone.getTransport().start();
      }
    } else {
      if (Tone.getTransport().state === "started") {
        Tone.getTransport().pause();
      }
    }
  }, [isPlaying]);
  const { seekRequest } = useAudioStore();
  const lastSeekTimestamp = useRef<number>(0);

  useEffect(() => {
    if (seekRequest && seekRequest.timestamp > lastSeekTimestamp.current) {
      lastSeekTimestamp.current = seekRequest.timestamp;
      Tone.getTransport().position = `${seekRequest.bar}:0:0`;
    }
  }, [seekRequest]);
  useEffect(() => {
    let animationFrameId: number;
    let lastUpdate = 0;
    const throttleMs = 16;
    let frameCount = 0;

    const updatePlayhead = (timestamp: number) => {
      if (timestamp - lastUpdate >= throttleMs) {
        const transportState = Tone.getTransport().state;
        if (transportState === "started") {
          const position = Tone.getTransport().position.toString().split(":");
          const bars = parseInt(position[0]);
          const beats = parseInt(position[1]);
          const sixteenths = parseFloat(position[2]);
          const currentPos = bars + beats / 4 + sixteenths / 16;
          useAudioStore.getState().setCurrentBar(currentPos);
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
  }, []);

  return { initAudio, startRecording, stopRecording, renderAudio };
}
