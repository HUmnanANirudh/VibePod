# VibePod

**AI-Powered Music Creation Platform**

A browser-based generative AI music composition tool with an intuitive DAW-like editor, real-time audio synthesis using Tone.js, and Google authentication for seamless project management.

---

## Overview

**VibePod** is a web-based music creation platform that democratizes music production by combining:

- **AI-Powered Arrangement** - Generate complete multi-track projects from text prompts
- **Professional Audio Engine** - Real-time synthesis and effects powered by Tone.js
- **Multi-Track Timeline Editor** - Visual DAW-style interface with clip editing
- **Auto-Save to Cloud** - Never lose your work with automatic project syncing
- **Google Authentication** - Secure login with your Google account
- **Export to Audio** - Download your creations as high-quality audio files

VibePod enables users to compose, edit, and export music directly in the browser without professional software.

---

## Features

### AI Music Generation

Transform text descriptions into complete musical arrangements:

**Example Prompts:**
- "Chill lo-fi beat at 70 BPM"
- "Energetic synthwave track with drums"
- "Ambient pad with dark atmosphere"

**AI Capabilities:**
- Generates 5-7 track arrangements automatically
- Creates melodic patterns with scale-aware note placement
- Assigns professional synth presets per track type
- Adds musical effects (reverb, delay, distortion, etc.)
- Varies song structure with each generation (high temperature = 1.2)

### Real-Time Audio Synthesis

**Synthesizers:**
- Synth, AMSynth, FMSynth, DuoSynth
- MonoSynth, MembraneSynth, MetalSynth
- PluckSynth, NoiseSynth

**Audio Effects (Full Tone.js Library):**
- Time-based: Reverb, JCReverb, Freeverb, FeedbackDelay, PingPongDelay
- Modulation: Chorus, Phaser, Tremolo, Vibrato, AutoFilter, AutoWah, AutoPanner
- Distortion: Distortion, BitCrusher, Chebyshev
- Spatial: StereoWidener, FrequencyShifter
- Dynamic: PitchShift

**Master Chain Processing:**
- Professional compressor (threshold: -18dB, ratio: 3:1)
- Limiter (-0.5dB) to prevent clipping
- Separate gain control for monitoring and recording
- Swing timing (15%) for human feel

### Multi-Track Timeline Editor

**Timeline Features:**
- Horizontal timeline divided into bars/beats
- Vertical tracks for different instruments (bass, melody, drums, pad, lead, etc.)
- Drag clips to reposition on timeline
- Click empty space to create new clips
- Real-time playhead animation during playback
- Grid-snapped positioning for musical accuracy

**Clip Editing:**
- Resize clips by dragging edges
- Delete clips with right-click or keyboard
- Copy/paste clips between tracks (Ctrl+C, Ctrl+V)
- Visual clip editor modal with:
  - Volume control
  - Pitch shift (± semitones)
  - Effect selection and wet/dry mix
  - Note-level editing with piano roll

### Track Controls

Per-track mixing and control:
- **Volume Faders** - Adjust track level (0-100%)
- **Mute Button** - Silence individual tracks
- **Track Type Labels** - Color-coded by instrument role
- **Effect Indicators** - Visual badge when effects are active
- **Instrument Display** - Shows assigned synth type

### Auto-Save & Project Management

Never lose your work:

**Auto-Save Features:**
- Automatic save 1.5 seconds after any change
- Real-time sync indicator in transport bar
- Shows "Saving..." with spinner during save
- Shows "Saved" with cloud icon when synced
- Tracks volume changes, clip edits, effects, and structure

**Project Library:**
- Browse all saved projects in Sound Browser
- Load projects with one click
- View creation and update timestamps
- Auto-refresh when new projects are saved
- Zustand-powered state management

### Transport Controls

Professional playback controls:
- **Play/Pause** - Start/stop playback
- **Stop** - Stop and return to beginning
- **Skip Forward/Backward** - Jump by 8 bars
- **BPM Control** - Adjust tempo (60-200 BPM)
- **Time Display** - Shows current position (bars:beats:sixteenths)
- **Audio State Indicator** - Shows Tone.js context state
- **Auto-Save Status** - Cloud sync indicator

### Export to Audio

Download your finished tracks:

**Export Features:**
- Silent export (no audio plays during export)
- Progress bar shows export status (0-100%)
- Automatic duration calculation based on actual clip positions
- Exports only the length of your project (not full 128 bars)
- WebM audio format (high quality)
- Automatic download when complete

**Export Process:**
1. Click "Export" button in AI Prompt section
2. Watch progress bar update in real-time
3. Audio file downloads automatically when complete

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Shadcn UI** - Component library
- **Tone.js** - Web Audio synthesis and scheduling
- **Zustand** - Lightweight state management
- **Zod** - Schema validation

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Google Gemini AI** - Music generation model
- **better-auth** - Authentication library
- **Drizzle ORM** - Type-safe database queries
- **PostgreSQL (Neon)** - Cloud database
- **date-fns** - Date formatting utilities

### Audio Processing
- **Tone.js Transport** - Precise timing and scheduling
- **PolySynth** - Polyphonic synthesizers
- **Tone.Recorder** - Audio recording and export
- **Master Chain** - Compressor → Limiter → Gain
- **Effect Chain** - Per-track effect processing

## Project Structure

```
vibepod/
├── app/
│   ├── api/
│   │   ├── ai/arrange/          # AI music generation endpoint
│   │   ├── auth/                # Authentication routes
│   │   └── projects/            # Project CRUD operations
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Main page
├── components/
│   ├── ui/                      # Shadcn UI components
│   └── vibe/
│       ├── AIPrompt.tsx         # AI prompt input & export
│       ├── Timeline.tsx         # Main timeline grid
│       ├── Transport.tsx        # Playback controls
│       ├── TrackControls.tsx    # Per-track mixing
│       ├── ClipEditor.tsx       # Clip editing modal
│       └── SoundBrowser.tsx     # Project library
├── hooks/
│   ├── useAudioEngine.ts        # Tone.js audio engine
│   └── use-mobile.ts            # Mobile detection
├── lib/
│   ├── audioPresets.ts          # Synth presets
│   ├── audioUtils.ts            # Audio utilities
│   ├── musicUtils.ts            # Music theory helpers
│   ├── schema.ts                # Zod schemas
│   ├── auth.ts                  # better-auth config
│   └── auth-client.ts           # Auth client
├── store/
│   └── useAudioStore.ts         # Global state management
├── db/
│   ├── index.ts                 # Database connection
│   └── schema.ts                # Database schema
└── public/                      # Static assets
```

---

## Usage Guide

### Creating Your First Track

1. **Login** - Click "Login with Google" when the modal appears
2. **Generate** - Enter a prompt like "upbeat electronic track at 128 BPM"
3. **Edit** - Click clips to adjust volume, pitch, or effects
4. **Mix** - Use track controls to balance levels and mute tracks
5. **Export** - Click "Export" to download your creation

### Editing Tips

- **Click empty timeline space** - Creates a new 2-bar clip
- **Drag clip edges** - Resize clip duration
- **Right-click clip** - Delete clip
- **Ctrl/Cmd + C/V** - Copy and paste clips
- **Click playhead bar** - Seek to position
- **Drag playhead** - Scrub through timeline

### Keyboard Shortcuts

- **Spacebar** - Play/Pause
- **Ctrl/Cmd + C** - Copy selected clip
- **Ctrl/Cmd + V** - Paste copied clip
- **Delete/Backspace** - Delete selected clip

---

## Roadmap

### Completed (v1.0)
- AI-powered music generation with Gemini
- Multi-track timeline editor with drag-and-drop
- Real-time audio synthesis with Tone.js
- 9 synthesizers + 18 audio effects
- Clip editing with visual editor
- Google authentication with better-auth
- Auto-save to PostgreSQL database
- Project library with load/save
- Export to audio file
- Professional master chain processing
- Responsive UI with dark theme

### In Progress
- Audio file upload and slicing
- Waveform visualization
- More AI remix commands
- Collaboration features
- Mobile responsiveness & touch optimization
