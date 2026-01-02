"use client";
import { useAudioEngine } from '@/hooks/useAudioEngine';
import { Transport } from '@/components/vibe/Transport';
import { Timeline } from '@/components/vibe/Timeline';
import { AIPrompt } from '@/components/vibe/AIPrompt';
import { SoundBrowser } from '@/components/vibe/SoundBrowser';
import { useAudioStore } from '@/store/useAudioStore';

export default function Home() {
  const { initAudio } = useAudioEngine();
  const { project } = useAudioStore();

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      <Transport initAudio={initAudio} />
      <div className="flex flex-1 overflow-hidden">
        <SoundBrowser />
        <div className="flex-1 flex flex-col min-w-0 bg-[#121214]">
            <div className="p-4 border-b border-zinc-800 bg-[#18181b] shadow-lg z-10">
                 <AIPrompt />
            </div>
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
