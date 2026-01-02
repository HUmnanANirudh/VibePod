import React from "react";

interface PlayheadProps {
  currentBar: number;
  draggedPlayheadBar: number | null;
  pixelsPerBar: number;
  draggingPlayhead: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
}

export const Playhead = React.memo(function Playhead({ currentBar, draggedPlayheadBar, pixelsPerBar,onMouseDown }: PlayheadProps) {
  const position = (draggedPlayheadBar !== null ? draggedPlayheadBar : currentBar) * pixelsPerBar;
  
  return (
    <div
      className="absolute top-0 bottom-0 z-20 cursor-grab active:cursor-grabbing group"
      style={{
        left: position,
        transform: 'translate3d(0, 0, 0)',
        willChange: 'left',
      }}
      onMouseDown={onMouseDown}
      title="Drag to scrub timeline"
    >
      <div className="absolute -left-5 top-0 bottom-0 w-10"></div>
      <div className="absolute top-0 -left-1.5 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-8 border-t-cyan-500"></div>
      <div className="absolute -left-0.5 top-0 bottom-0 w-0.5 bg-cyan-500 shadow-[0_0_10px_2px_rgba(6,182,212,0.5)] group-hover:w-1 group-hover:shadow-[0_0_15px_3px_rgba(6,182,212,0.6)] transition-all"></div>
    </div>
  );
});
