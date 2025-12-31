import { z } from "zod";

/* ---------------- NOTES ---------------- */

export const NoteSchema = z.object({
  pitch: z.string(),              // "C4"
  startTime: z.string(),          // "0:0"
  duration: z.string(),           // "4n", "1:0"
  velocity: z.number().min(0).max(1).optional(),
});

export type Note = z.infer<typeof NoteSchema>;

/* ---------------- CLIPS ---------------- */

export const ClipSchema = z.object({
  startBar: z.number().int().min(0),
  durationBars: z.number().int().min(1),
  notes: z.array(NoteSchema),
});

export type Clip = z.infer<typeof ClipSchema>;

/* ---------------- INSTRUMENT ---------------- */

export const InstrumentSchema = z.object({
  type: z.enum([
    "Synth",
    "MembraneSynth",
    "MetalSynth",
    "FMSynth",
    "AMSynth",
  ]),
  options: z.any().optional(),
});

/* ---------------- TRACK ---------------- */

export const TrackSchema = z.object({
  id: z.string(),
  type: z.enum(["drums", "bass", "melody", "pad", "fx"]),
  instrument: InstrumentSchema,
  volume: z.number().min(0).max(1),
  muted: z.boolean(),
  clips: z.array(ClipSchema),
});

export type Track = z.infer<typeof TrackSchema>;

/* ---------------- PROJECT ---------------- */

export const ProjectSchema = z.object({
  bpm: z.number().min(60).max(160),
  tracks: z.array(TrackSchema),
});

export type Project = z.infer<typeof ProjectSchema>;
