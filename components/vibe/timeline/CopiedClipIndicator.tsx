import { Copy } from "lucide-react";

interface CopiedClipIndicatorProps {
  show: boolean;
}

export function CopiedClipIndicator({ show }: CopiedClipIndicatorProps) {
  if (!show) return null;

  return (
    <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 bg-cyan-500/90 text-white text-xs px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2 pointer-events-none">
      <Copy className="w-3 h-3" />
      <span>Clip copied • Ctrl+Click to paste</span>
    </div>
  );
}
