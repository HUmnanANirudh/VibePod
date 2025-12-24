import { z } from "zod";

export const ClipSchema = z.object({
  startBar: z.number().int().min(0),
  durationBars: z.number().int().min(1),
});

export type Clip = z.infer<typeof ClipSchema>;

export const TrackSchema = z.object({
  id: z.string(),
  type: z.enum(["drums", "bass", "melody", "pad", "fx"]),
  loopId: z.string(),
  volume: z.number().min(0).max(1),
  pitch: z.number().int().min(-12).max(12),
  muted: z.boolean(),
  clips: z.array(ClipSchema),
});

export type Track = z.infer<typeof TrackSchema>;

export const ProjectSchema = z.object({
  bpm: z.number().min(60).max(160),
  tracks: z.array(TrackSchema),
});

export type Project = z.infer<typeof ProjectSchema>;
