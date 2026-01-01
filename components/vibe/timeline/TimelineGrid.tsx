interface TimelineGridProps {
  totalBars: number;
  pixelsPerBar: number;
}

export function TimelineGrid({ totalBars, pixelsPerBar }: TimelineGridProps) {
  return (
    <div className="absolute inset-0 flex pointer-events-none">
      {Array.from({ length: totalBars }).map((_, i) => (
        <div
          key={i}
          className="shrink-0 border-r border-dashed border-zinc-800/30 h-full"
          style={{ width: pixelsPerBar }}
        ></div>
      ))}
    </div>
  );
}
