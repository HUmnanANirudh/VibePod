"use client";
import { useAudioEngine } from '@/hooks/useAudioEngine';
import { Transport } from '@/components/vibe/Transport';
import { Timeline } from '@/components/vibe/Timeline';
import { AIPrompt } from '@/components/vibe/AIPrompt';
import { MOCK_LOOPS } from '@/lib/audioUtils';
import { useAudioStore } from '@/store/useAudioStore';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Music4 } from 'lucide-react';

export default function Home() {
  const { initAudio } = useAudioEngine();
  const { project } = useAudioStore();

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      {/* Header / Transport */}
      <Transport initAudio={initAudio} />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar / Library */}
        <div className="w-64 border-r bg-card/30 flex flex-col">
          <div className="p-4 border-b font-bold flex items-center gap-2">
             <Music4 className="w-4 h-4" /> Library
          </div>
          <ScrollArea className="flex-1">
             <div className="p-2 space-y-2">
                 {Object.keys(MOCK_LOOPS).map(loopId => (
                     <div key={loopId} className="p-2 hover:bg-muted rounded text-sm cursor-grab active:cursor-grabbing border border-transparent hover:border-border">
                         {loopId}
                     </div>
                 ))}
             </div>
          </ScrollArea>
        </div>

        {/* Workspace */}
        <div className="flex-1 flex flex-col min-w-0 bg-zinc-950/50">
            {/* Top Bar for AI */}
            <div className="p-6 border-b flex justify-center bg-gradient-to-b from-background/50 to-transparent">
                 <AIPrompt />
            </div>

            {/* Timeline */}
            <div className="flex-1 overflow-hidden flex flex-col relative">
                {project && project.tracks.length > 0 ? (
                    <Timeline />
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground opacity-50">
                        <div className="text-4xl font-thin tracking-tighter mb-4">VibePod</div>
                        <p>Enter a prompt above to generate a track or drag loops from the library.</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
