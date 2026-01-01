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
      <DialogContent className="sm:max-w-125 bg-zinc-900 border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-zinc-100 flex items-center justify-between">
            <span>Edit Clip</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="chord" className="text-zinc-300 text-sm font-semibold">
              Chord
            </Label>
            <Select value={chord} onValueChange={setChord}>
              <SelectTrigger className="w-full bg-zinc-800 border-zinc-700 text-zinc-100">
                <SelectValue placeholder="Select chord" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700 max-h-60">
                {availableChords.map((c) => (
                  <SelectItem 
                    key={c} 
                    value={c}
                    className="text-zinc-100 focus:bg-zinc-700 focus:text-zinc-100"
                  >
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="pitch" className="text-zinc-300 text-sm font-semibold">
                Pitch
              </Label>
              <span className="text-xs text-zinc-500 font-mono">{pitch > 0 ? '+' : ''}{pitch} semitones</span>
            </div>
            <Slider
              id="pitch"
              value={[pitch]}
              min={-12}
              max={12}
              step={1}
              onValueChange={(v) => setPitch(v[0])}
              className="[&>.absolute]:bg-zinc-700 [&_span]:bg-cyan-500 [&_span]:border-cyan-600"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="volume" className="text-zinc-300 text-sm font-semibold">
                Volume
              </Label>
              <span className="text-xs text-zinc-500 font-mono">{Math.round(volume * 100)}%</span>
            </div>
            <Slider
              id="volume"
              value={[volume]}
              min={0}
              max={1}
              step={0.01}
              onValueChange={(v) => setVolume(v[0])}
              className="[&>.absolute]:bg-zinc-700 [&_span]:bg-green-500 [&_span]:border-green-600"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="effect" className="text-zinc-300 text-sm font-semibold">
              Effect
            </Label>
            <Select value={effect} onValueChange={setEffect}>
              <SelectTrigger className="w-full bg-zinc-800 border-zinc-700 text-zinc-100">
                <SelectValue placeholder="Select effect" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                {EFFECT_TYPES.map((e) => (
                  <SelectItem 
                    key={e} 
                    value={e}
                    className="text-zinc-100 focus:bg-zinc-700 focus:text-zinc-100"
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
                <Label htmlFor="effectAmount" className="text-zinc-300 text-sm font-semibold">
                  Effect Amount
                </Label>
                <span className="text-xs text-zinc-500 font-mono">{Math.round(effectAmount * 100)}%</span>
              </div>
              <Slider
                id="effectAmount"
                value={[effectAmount]}
                min={0}
                max={1}
                step={0.01}
                onValueChange={(v) => setEffectAmount(v[0])}
                className="[&>.absolute]:bg-zinc-700 [&_span]:bg-purple-500 [&_span]:border-purple-600"
              />
            </div>
          )}

          <div className="pt-4 border-t border-zinc-800">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-zinc-500">Start Bar:</span>
                  <span className="ml-2 text-zinc-300 font-mono">{clip.startBar + 1}</span>
                </div>
                <div>
                  <span className="text-zinc-500">Duration:</span>
                  <span className="ml-2 text-zinc-300 font-mono">{clip.durationBars} bars</span>
                </div>
              </div>
              <div>
                <div className="text-xs text-zinc-500 mb-2">Notes in Clip:</div>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {clip.notes.map((note, idx) => (
                    <div key={idx} className="text-xs bg-zinc-800/50 rounded px-2 py-1.5 flex justify-between items-center">
                      <span className="text-zinc-300 font-mono">{note.pitch}</span>
                      <div className="flex gap-3 text-zinc-500">
                        <span>Start: {note.startTime}</span>
                        <span>Duration: {note.duration}</span>
                        {note.velocity && <span>Vel: {Math.round(note.velocity * 100)}%</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-zinc-800">
          <Button
            variant="outline"
            onClick={onClose}
            className="bg-transparent border-zinc-700 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
