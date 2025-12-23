# VibePod

**AI-Powered Music Creation Platform**

A browser-based generative AI music composition tool combining a lightweight DAW-like editor with intelligent orchestration, visual editing, and a royalty-free beat marketplace. 

---

## Overview

**VibePod** is a web-based music creation platform that democratizes music production by combining: 

- Generative AI for creative orchestration
- Multi-track DAW-like editor for visual composition
- Real-time audio visualization
- Royalty-free beat marketplace
- Audio slicing and remixing tools

VibePod enables users to compose, remix, visualize, and export music without professional software.

---

## User Personas

### Beginner Creator
- No DAW experience required
- Uses AI prompts and presets
- Relies on AI to assemble tracks automatically

### Indie Producer
- Drags and arranges loops manually
- Adjusts pitch, volume, and track structure
- Uploads and slices custom recordings

### Experimental Coder-Musician
- Uses Strudel-inspired logic patterns
- Tweaks timing and layering in real-time
- Pushes creative boundaries with code-like controls

---

## Features

### Beat Marketplace (Royalty-Free Library)

Browse and import legally safe, structured audio assets:  
- Curated royalty-free loops and beats
- Categorized by genre, BPM, musical key, and instrument type
- Preview audio before importing into your project

**User Flow:** Browse → Preview → Import

### Multi-Track Timeline Editor (Mini DAW)

Visual music arrangement interface: 
- Horizontal timeline divided into bars/beats
- Vertical tracks for different instruments
- Drag, loop, move, and delete clips
- Professional DAW experience in the browser

### Track-Level Controls

Fine-grained control for each instrument track:
- Volume adjustment
- Pitch shift (± semitones)
- Solo/Mute for playback isolation
- Real-time parameter tweaking

### Real-Time Audio Visualization

Dynamic visual feedback during playback:
- Global frequency spectrum analyzer
- Per-track waveform activity display
- Synced playhead animation

### Upload, Slice & Reuse Audio

Remix external audio files:
1. Upload audio (WAV/MP3)
2. View waveform visualization
3. Select regions to slice
4. Reuse sliced clips in your project

### AI Prompt → Music Arrangement

Lower the entry barrier with AI-powered generation: 

**Example:**
```
Prompt: "Chill lo-fi beat at 70 BPM"
```

**AI Actions:**
- Selects appropriate loops from marketplace
- Sets project BPM
- Creates initial track layout
- Generates starting arrangement

### AI Remix Commands

Creative iteration with one-click transformations: 

**Available Commands:**
- "Make it darker" - Add moody elements
- "Increase energy" - Boost tempo and intensity
- "Strip it down" - Minimize to essentials

**AI Modifications:**
- Adjusts track parameters
- Adds/removes clips intelligently
- Modifies tempo and pitch

### Project Save & Load

Session persistence and project management:
- Save complete project state
- Reload projects anytime
- Manage multiple projects per user

### Export

Export your final creations: 
- WAV format (high quality, uncompressed)
- MP3 format (compressed, shareable)

---

## Roadmap

### MVP (Current Phase)
- Project setup and architecture
- Beat marketplace implementation
- Multi-track timeline editor
- AI prompt-to-music generation
- Basic export functionality
