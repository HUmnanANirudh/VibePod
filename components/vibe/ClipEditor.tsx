"use client";

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAudioStore } from '@/store/useAudioStore';

interface ClipEditorProps {
  open: boolean;
  onClose: () => void;
  trackId: string;
  clipIndex: number;
}

const CHORDS = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
  'Cm', 'C#m', 'Dm', 'D#m', 'Em', 'Fm', 'F#m', 'Gm', 'G#m', 'Am', 'A#m', 'Bm',
  'C1', 'C2', 'C3', 'C4', 'D1', 'D2', 'D3', 'D4',
  'E1', 'E2', 'E3', 'E4', 'F1', 'F2', 'F3', 'F4',
  'G1', 'G2', 'G3', 'G4', 'A1', 'A2', 'A3', 'A4',
  'C7', 'D7', 'E7', 'F7', 'G7', 'A7', 'B7',
  'Cmaj7', 'Dmaj7', 'Emaj7', 'Fmaj7', 'Gmaj7', 'Amaj7', 'Bmaj7'
];

const EFFECT_TYPES = [
  'None',
  'Distortion',
  'Reverb',
  'Chorus',
  'FeedbackDelay',
  'PingPongDelay',
  'Phaser',
  'BitCrusher',
  'AutoFilter',
  'PitchShift',
  'Tremolo',
  'Vibrato'
];

export function ClipEditor({ open, onClose, trackId, clipIndex }: ClipEditorProps) {
  const { project, updateTrack } = useAudioStore();
  const [chord, setChord] = useState('C');
  const [pitch, setPitch] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [effect, setEffect] = useState('None');
  const [effectAmount, setEffectAmount] = useState(0.5);
  const [availableChords, setAvailableChords] = useState<string[]>(CHORDS);

  const track = project?.tracks.find(t => t.id === trackId);
  const clip = track?.clips[clipIndex];

  useEffect(() => {
    if (clip) {
      setVolume(clip.volume || 0.8);
      setChord(clip.chord || (clip.notes[0]?.pitch || 'C'));
      setPitch(clip.pitch || 0);
      setEffect(clip.effect || 'None');
      setEffectAmount(clip.effectAmount || 0.5);
      
      // Extract unique pitches from clip notes
      const clipPitches = clip.notes.map(note => note.pitch);
      const uniquePitches = Array.from(new Set(clipPitches));
      setAvailableChords([...new Set([...uniquePitches, ...CHORDS])]);
    }
  }, [clip]);

  const handleSave = () => {
    if (!track || !clip) return;

    const newClips = [...track.clips];
    newClips[clipIndex] = {
      ...clip,
      volume,
      chord,
      pitch,
      effect,
      effectAmount,
    };

    updateTrack(trackId, { clips: newClips });
    onClose();
  };

  if (!clip) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-125 bg-zinc-900 rounded-sm border-x-4 border-zinc-800 shadow-2xl p-0 overflow-hidden border-y-0 gap-0">
        {/* Decorative Screws */}
        <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-zinc-700 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.8)] z-50 flex items-center justify-center pointer-events-none">
          <div className="w-1.5 h-0.5 bg-zinc-900 rotate-45"></div>
        </div>
        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-zinc-700 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.8)] z-50 flex items-center justify-center pointer-events-none">
          <div className="w-1.5 h-0.5 bg-zinc-900 rotate-45"></div>
        </div>
        <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-zinc-700 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.8)] z-50 flex items-center justify-center pointer-events-none">
          <div className="w-1.5 h-0.5 bg-zinc-900 rotate-45"></div>
        </div>
        <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-zinc-700 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.8)] z-50 flex items-center justify-center pointer-events-none">
          <div className="w-1.5 h-0.5 bg-zinc-900 rotate-45"></div>
        </div>

        <DialogHeader className="bg-zinc-800 p-1 border-b border-white/5 flex flex-row items-center justify-between px-4 h-9 space-y-0">
          <DialogTitle className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase flex items-center gap-2">
            <span>Clip Properties // V1.0</span>
          </DialogTitle>
          <div className="flex gap-1">
             <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse shadow-[0_0_4px_rgba(34,197,94,0.8)]"></div>
             <div className="w-1 h-1 bg-zinc-600 rounded-full"></div>
             <div className="w-1 h-1 bg-zinc-600 rounded-full"></div>
          </div>
        </DialogHeader>

        <div className="space-y-6 p-6 pb-2 relative">
           <div className="absolute inset-0 pointer-events-none bg-linear-to-br from-white/5 to-transparent z-0"></div>
           <div className="relative z-10 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="chord" className="text-zinc-300 text-sm font-semibold tracking-tight uppercase text-[10px] text-cyan-500/80">
              Chord Selection
            </Label>
            <Select value={chord} onValueChange={setChord}>
              <SelectTrigger className="w-full bg-zinc-950 border-zinc-800 text-cyan-400 font-mono text-sm h-10 rounded-sm focus:ring-1 focus:ring-cyan-500 shadow-[inset_0_2px_8px_rgba(0,0,0,0.5)]">
                <SelectValue placeholder="Select chord" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800 max-h-60">
                {availableChords.map((c) => (
                  <SelectItem 
                    key={c} 
                    value={c}
                    className="text-zinc-400 focus:bg-zinc-800 focus:text-cyan-400 font-mono"
                  >
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="pitch" className="text-zinc-300 text-sm font-semibold tracking-tight uppercase text-[10px] text-cyan-500/80">
                Pitch Offset
              </Label>
              <span className="text-xs text-cyan-500/80 font-mono bg-zinc-950 px-2 py-0.5 rounded-sm border border-zinc-800 shadow-inner">{pitch > 0 ? '+' : ''}{pitch} semitones</span>
            </div>
            <Slider
              id="pitch"
              value={[pitch]}
              min={-12}
              max={12}
              step={1}
              onValueChange={(v) => setPitch(v[0])}
              className="[&>.absolute]:bg-zinc-800 [&_span]:bg-cyan-500 [&_span]:border-cyan-400 [&_span]:shadow-[0_0_10px_rgba(6,182,212,0.5)]"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="volume" className="text-zinc-300 text-sm font-semibold tracking-tight uppercase text-[10px] text-cyan-500/80">
                Gain Level
              </Label>
              <span className="text-xs text-cyan-500/80 font-mono bg-zinc-950 px-2 py-0.5 rounded-sm border border-zinc-800 shadow-inner">{Math.round(volume * 100)}%</span>
            </div>
            <Slider
              id="volume"
              value={[volume]}
              min={0}
              max={1}
              step={0.01}
              onValueChange={(v) => setVolume(v[0])}
              className="[&>.absolute]:bg-zinc-800 [&_span]:bg-green-500 [&_span]:border-green-400 [&_span]:shadow-[0_0_10px_rgba(34,197,94,0.5)]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="effect" className="text-zinc-300 text-sm font-semibold tracking-tight uppercase text-[10px] text-cyan-500/80">
              FX Processor
            </Label>
            <Select value={effect} onValueChange={setEffect}>
              <SelectTrigger className="w-full bg-zinc-950 border-zinc-800 text-cyan-400 font-mono text-sm h-10 rounded-sm focus:ring-1 focus:ring-cyan-500 shadow-[inset_0_2px_8px_rgba(0,0,0,0.5)]">
                <SelectValue placeholder="Select effect" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800">
                {EFFECT_TYPES.map((e) => (
                  <SelectItem 
                    key={e} 
                    value={e}
                    className="text-zinc-400 focus:bg-zinc-800 focus:text-cyan-400 font-mono"
                  >
                    {e}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {effect !== 'None' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="effectAmount" className="text-zinc-300 text-sm font-semibold tracking-tight uppercase text-[10px] text-cyan-500/80">
                  Dry / Wet
                </Label>
                <span className="text-xs text-cyan-500/80 font-mono bg-zinc-950 px-2 py-0.5 rounded-sm border border-zinc-800 shadow-inner">{Math.round(effectAmount * 100)}%</span>
              </div>
              <Slider
                id="effectAmount"
                value={[effectAmount]}
                min={0}
                max={1}
                step={0.01}
                onValueChange={(v) => setEffectAmount(v[0])}
                className="[&>.absolute]:bg-zinc-800 [&_span]:bg-purple-500 [&_span]:border-purple-400 [&_span]:shadow-[0_0_10px_rgba(168,85,247,0.5)]"
              />
            </div>
          )}

          <div className="pt-4 border-t border-zinc-800/50">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-zinc-600 uppercase tracking-wider text-[10px] font-bold">Start Bar</span>
                  <span className="ml-2 text-cyan-500/80 font-mono">{clip.startBar + 1}</span>
                </div>
                <div>
                  <span className="text-zinc-600 uppercase tracking-wider text-[10px] font-bold">Duration</span>
                  <span className="ml-2 text-cyan-500/80 font-mono">{clip.durationBars} bars</span>
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold tracking-widest text-zinc-600 uppercase mb-2">Note Data</div>
                <div className="max-h-32 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                  {clip.notes.map((note, idx) => (
                    <div key={idx} className="text-xs bg-black/40 border border-zinc-800/50 rounded-sm px-2 py-1.5 flex justify-between items-center group hover:border-zinc-700 transition-colors">
                      <span className="text-zinc-400 font-mono group-hover:text-cyan-400">{note.pitch}</span>
                      <div className="flex gap-3 text-zinc-600 font-mono text-[10px]">
                        <span>T: {note.startTime}</span>
                        <span>D: {note.duration}</span>
                        {note.velocity && <span>V: {Math.round(note.velocity * 100)}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 p-4 pt-0">
          <Button
            variant="outline"
            onClick={onClose}
            className="rounded-sm bg-zinc-800 border-2 border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 hover:bg-zinc-900 shadow-[2px_2px_0_rgba(0,0,0,0.5)] active:translate-y-0.5 active:shadow-none transition-all font-mono font-bold tracking-tighter"
          >
            CANCEL
          </Button>
          <Button
            onClick={handleSave}
            className="rounded-sm bg-cyan-900/30 border-2 border-cyan-700 text-cyan-400 hover:text-cyan-300 hover:border-cyan-500 hover:bg-cyan-900/50 shadow-[2px_2px_0_rgba(0,0,0,0.5)] active:translate-y-0.5 active:shadow-none transition-all font-mono font-bold tracking-tighter"
          >
            APPLY CHANGES
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
