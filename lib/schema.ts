import { z } from "zod";

export const NoteSchema = z.object({
  pitch: z.string(), // e.g., "C4", "A#3"
  startTime: z.string(), // "0:0:0" format or "4n"
  duration: z.string(), // "8n", "1m"
  velocity: z.number().min(0).max(1).optional(),
});

export type Note = z.infer<typeof NoteSchema>;

export const ClipSchema = z.object({
  startBar: z.number().int().min(0),
  durationBars: z.number().int().min(1),
  notes: z.array(NoteSchema),
});

export type Clip = z.infer<typeof ClipSchema>;

export const InstrumentSchema = z.object({
  type: z.enum(["Synth", "MembraneSynth", "MetalSynth", "FMSynth", "AMSynth"]),
  options: z.any().optional(), // Flexible for synth params
});

export const TrackSchema = z.object({
  id: z.string(),
  type: z.enum(["drums", "bass", "melody", "pad", "fx"]),
  instrument: InstrumentSchema,
  volume: z.number().min(0).max(1),
  muted: z.boolean(),
  clips: z.array(ClipSchema),
});

export type Track = z.infer<typeof TrackSchema>;

export const ProjectSchema = z.object({
  bpm: z.number().min(60).max(160),
  tracks: z.array(TrackSchema),
});

export type Project = z.infer<typeof ProjectSchema>;
