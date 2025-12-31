import React, { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Music4,
  Search,
  ChevronDown,
  ChevronRight,
  Play,
  Volume2,
} from "lucide-react";
import {
  getCategories,
  getSoundsByCategory,
  searchSounds,
  SoundPreset,
} from "@/lib/soundLibrary";
import * as Tone from "tone";
import { cn } from "@/lib/utils";

interface SoundBrowserProps {
  onSoundDrop?: (sound: SoundPreset) => void;
}

export function SoundBrowser({ onSoundDrop }: SoundBrowserProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(["Drums"])
  );
  const [playingSound, setPlayingSound] = useState<string | null>(null);
  const [draggingSound, setDraggingSound] = useState<SoundPreset | null>(null);
  const synthRef = useRef<any>(null);

  const categories = getCategories();
  const filteredResults = searchQuery ? searchSounds(searchQuery) : null;

  useEffect(() => {
    return () => {
      if (synthRef.current) {
        synthRef.current.dispose();
        synthRef.current = null;
      }
    };
  }, []);

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const previewSound = async (sound: SoundPreset) => {
    try {
      await Tone.start();

      if (synthRef.current) {
        synthRef.current.dispose();
      }

      const SynthClass = (Tone as any)[sound.instrumentType];
      if (!SynthClass) {
        console.error("Unknown synth type:", sound.instrumentType);
        return;
      }

      const synth = new SynthClass(sound.settings).toDestination();
      synthRef.current = synth;

      setPlayingSound(sound.id);

      const note = sound.previewNote || "C4";
      const duration = sound.previewDuration || "4n";

      if (sound.instrumentType === "NoiseSynth") {
        synth.triggerAttackRelease(duration);
      } else {
        synth.triggerAttackRelease(note, duration);
      }
      setTimeout(() => {
        setPlayingSound(null);
        if (synthRef.current) {
          synthRef.current.dispose();
          synthRef.current = null;
        }
      }, Tone.Time(duration).toMilliseconds() + 100);
    } catch (error) {
      console.error("Error playing sound:", error);
      setPlayingSound(null);
    }
  };

  const handleDragStart = (e: React.DragEvent, sound: SoundPreset) => {
    setDraggingSound(sound);
    e.dataTransfer.effectAllowed = "copy";
    e.dataTransfer.setData("application/json", JSON.stringify(sound));
    const dragPreview = document.createElement("div");
    dragPreview.className =
      "bg-cyan-600 text-white px-3 py-1 rounded text-xs font-bold shadow-lg";
    dragPreview.textContent = sound.name;
    dragPreview.style.position = "absolute";
    dragPreview.style.top = "-1000px";
    document.body.appendChild(dragPreview);
    e.dataTransfer.setDragImage(dragPreview, 0, 0);
    setTimeout(() => document.body.removeChild(dragPreview), 0);
  };

  const handleDragEnd = () => {
    setDraggingSound(null);
  };

  const renderSound = (sound: SoundPreset) => (
    <div
      key={sound.id}
      className={cn(
        "group flex items-center gap-2 px-3 py-1.5 cursor-grab active:cursor-grabbing",
        "hover:bg-cyan-900/20 hover:text-cyan-400 text-zinc-400",
        "border-b border-zinc-800/50 text-[11px] font-mono transition-colors",
        playingSound === sound.id && "bg-cyan-900/30 text-cyan-300"
      )}
      draggable
      onDragStart={(e) => handleDragStart(e, sound)}
      onDragEnd={handleDragEnd}
      onClick={() => previewSound(sound)}
      title={`Click to preview, drag to add to timeline`}
    >
      <button
        className={cn(
          "w-3 h-3 flex items-center justify-center transition-all",
          playingSound === sound.id
            ? "text-cyan-400"
            : "text-zinc-600 group-hover:text-cyan-500"
        )}
        onClick={(e) => {
          e.stopPropagation();
          previewSound(sound);
        }}
      >
        {playingSound === sound.id ? (
          <Volume2 className="w-3 h-3 animate-pulse" />
        ) : (
          <Play className="w-2.5 h-2.5" />
        )}
      </button>

      <span className="truncate flex-1">{sound.name}</span>

      {sound.subcategory && (
        <span className="ml-auto text-zinc-700 text-[9px] uppercase">
          {sound.subcategory}
        </span>
      )}
    </div>
  );

  return (
      <div className="w-72 border-r border-zinc-800 bg-[#1e1e20] flex flex-col shadow-2xl z-20 h-full">

        <div className="h-8 bg-zinc-900 border-b border-black flex items-center px-3 justify-between shrink-0">
          <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
            <Music4 className="w-3 h-3" /> Sound Browser
          </div>
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-zinc-700"></div>
            <div className="w-2 h-2 rounded-full bg-zinc-700"></div>
          </div>
        </div>
        <div className="p-2 border-b border-zinc-800 bg-zinc-800/50 shrink">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-600" />
            <input
              className="w-full bg-black/50 border border-zinc-700 rounded-sm text-[10px] pl-7 pr-2 py-1 text-zinc-400 placeholder:text-zinc-700 focus:outline-none focus:border-cyan-500"
              placeholder="Search sounds..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <ScrollArea className="flex-1 bg-[#18181b] min-h-0">
          <div className="flex flex-col pb-2">
            {filteredResults ? (
              <>
                <div className="px-2 py-1 text-[9px] font-bold text-zinc-600 uppercase bg-zinc-900/50 border-b border-zinc-800 sticky top-0 z-10">
                  {filteredResults.length} Results
                </div>
                {filteredResults.map(renderSound)}
              </>
            ) : (
              categories.map((category) => {
                const isExpanded = expandedCategories.has(category);
                const sounds = getSoundsByCategory(category);

                return (
                  <div key={category}>
                    <div
                      className="px-2 py-1.5 text-[10px] font-bold text-zinc-300 uppercase bg-zinc-900/50 border-b border-zinc-800 cursor-pointer hover:bg-zinc-800/70 transition-colors flex items-center gap-2 sticky top-0 z-10"
                      onClick={() => toggleCategory(category)}
                    >
                      {isExpanded ? (
                        <span>📂</span>
                      ) : (
                        <span>📁</span>
                      )}
                      <span className="flex-1">{category}</span>
                      <span className="text-[9px] text-zinc-600">
                        {sounds.length}
                      </span>
                    </div>
                    {isExpanded && sounds.map(renderSound)}
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
        <div className="h-6 bg-zinc-900 border-t border-black flex items-center px-2 text-[9px] text-zinc-600 font-mono shrink-0">
          {searchQuery
            ? `${filteredResults?.length || 0} SOUNDS`
            : `${categories.reduce(
                (sum, cat) => sum + getSoundsByCategory(cat).length,
                0
              )} SOUNDS // READY`}
        </div>
      </div>
  );
}
