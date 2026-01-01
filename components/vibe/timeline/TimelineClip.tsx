import { Copy, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { LOOP_COLORS } from "@/lib/audioUtils";
import type { Clip } from "@/lib/schema";
import React from "react";

interface TimelineClipProps {
  clip: Clip;
  clipIndex: number;
  trackId: string;
  trackType: string;
  trackInstrumentType?: string;
  displayStartBar: number;
  pixelsPerBar: number;
  isBeingDragged: boolean;
  isCopied: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onClick: (e: React.MouseEvent) => void;
  onCopy: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  copiedClip: any;
}

export const TimelineClip = React.memo(function TimelineClip({
  clip,
  trackType,
  trackInstrumentType,
  displayStartBar,
  pixelsPerBar,
  isBeingDragged,
  isCopied,
  onMouseDown,
  onClick,
  onCopy,
  onDelete,
  copiedClip,
}: TimelineClipProps) {
  return (
    <div
      className={cn(
        "absolute top-1 bottom-1 rounded border-t border-white/20 border-b shadow-md cursor-grab active:cursor-grabbing flex items-center justify-between overflow-hidden group/clip",
        LOOP_COLORS[trackType] || "bg-zinc-700",
        "after:absolute after:inset-0 after:bg-linear-to-b after:from-white/10 after:to-transparent hover:brightness-110",
        isBeingDragged ? "" : "transition-all",
        isCopied ? "ring-2 ring-cyan-500 ring-offset-1 ring-offset-zinc-950" : ""
      )}
      style={{
        left: displayStartBar * pixelsPerBar,
        width: clip.durationBars * pixelsPerBar,
      }}
      onMouseDown={onMouseDown}
      onClick={onClick}
      title={`Click to edit, Drag to move${copiedClip ? ', Ctrl+Click empty space to paste' : ''}`}
    >
      <div className="relative z-10 text-white/90 text-[10px] font-bold pointer-events-none truncate px-2 drop-shadow-md">
        {trackInstrumentType || "Clip"}
      </div>
      <div className="flex gap-1 absolute top-1 right-1 z-20 opacity-0 group-hover/clip:opacity-100 transition-opacity">
        <button
          onClick={onCopy}
          className="bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700 rounded p-1 pointer-events-auto"
          title="Copy clip"
        >
          <Copy className="w-3 h-3 text-zinc-300" />
        </button>
        <button
          onClick={onDelete}
          className="bg-zinc-900/90 hover:bg-red-900/90 border border-zinc-700 hover:border-red-800 rounded p-1 pointer-events-auto"
          title="Delete clip"
        >
          <Trash2 className="w-3 h-3 text-zinc-300 hover:text-red-400" />
        </button>
      </div>
    </div>
  );
});
