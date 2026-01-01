import { ScrollArea } from "@/components/ui/scroll-area";

interface TimelineRulerProps {
  totalBars: number;
  pixelsPerBar: number;
}

export function TimelineRuler({ totalBars, pixelsPerBar }: TimelineRulerProps) {
  return (
    <div className="flex h-8 border-b border-zinc-800 bg-zinc-900/90 backdrop-blur z-10 shadow-lg shrink-0">
      <div className="w-56 shrink-0 border-r border-zinc-800"></div>
      <ScrollArea className="flex-1" orientation="horizontal">
        <div className="flex h-8" style={{ width: totalBars * pixelsPerBar }}>
          {Array.from({ length: totalBars }).map((_, i) => (
            <div
              key={i}
              className="shrink-0 border-l border-zinc-700/50 px-1 text-[10px] font-mono text-zinc-500"
              style={{ width: pixelsPerBar }}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
