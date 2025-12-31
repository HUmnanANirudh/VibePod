"use client";
import { useAudioEngine } from '@/hooks/useAudioEngine';
import { Transport } from '@/components/vibe/Transport';
import { Timeline } from '@/components/vibe/Timeline';
import { AIPrompt } from '@/components/vibe/AIPrompt';
import { useAudioStore } from '@/store/useAudioStore';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Music4 } from 'lucide-react';

export default function Home() {
  const { initAudio } = useAudioEngine();
  const { project } = useAudioStore();
  

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      <Transport initAudio={initAudio} />
      <div className="flex flex-1 overflow-hidden">
        <div className="w-72 border-r border-zinc-800 bg-[#1e1e20] flex flex-col shadow-2xl z-20">
          <div className="h-8 bg-zinc-900 border-b border-black flex items-center px-3 justify-between">
             <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                <Music4 className="w-3 h-3" /> Browser
             </div>
             <div className="flex gap-1">
                 <div className="w-2 h-2 rounded-full bg-zinc-700"></div>
                 <div className="w-2 h-2 rounded-full bg-zinc-700"></div>
             </div>
          </div>
          
          <div className="p-2 border-b border-zinc-800 bg-zinc-800/50">
               <input className="w-full bg-black/50 border border-zinc-700 rounded-sm text-[10px] px-2 py-1 text-zinc-400 placeholder:text-zinc-700 focus:outline-none focus:border-zinc-500" placeholder="Search loops..." />
          </div>

          <ScrollArea className="flex-1 bg-[#18181b]">
             <div className="flex flex-col">
                 <div className="px-2 py-1 text-[9px] font-bold text-zinc-600 uppercase bg-zinc-900/50 border-b border-zinc-800">
                    Local / Loops
                 </div>
                 {/* {Object.keys(MOCK_LOOPS).map((loopId, i) => (
                     <div 
                        key={loopId} 
                        className="group flex items-center gap-2 px-3 py-1.5 hover:bg-cyan-900/20 hover:text-cyan-400 text-zinc-400 cursor-grab active:cursor-grabbing border-b border-zinc-800/50 text-[11px] font-mono transition-colors"
                     >
                         <div className="w-3 h-3 border border-zinc-700 rounded-sm bg-zinc-800 group-hover:border-cyan-600 flex items-center justify-center">
                             <div className="w-1.5 h-1.5 bg-zinc-600 group-hover:bg-cyan-500 rounded-full opacity-0 group-hover:opacity-100"></div>
                         </div>
                         <span className="truncate">{loopId}</span>
                         <span className="ml-auto text-zinc-700 text-[9px]">WAV</span>
                     </div>
                 ))} */}
                 
                 {/* Fake folders to make it look populated */}
                 {['Drums', 'Bass', 'Synths', 'FX', 'Vocals'].map(folder => (
                      <div key={folder} className="px-3 py-1.5 text-zinc-500 flex items-center gap-2 text-[11px] opacity-70">
                          <div className="w-3 h-3 text-zinc-600">📁</div> {folder}
                      </div>
                 ))}
             </div>
          </ScrollArea>
          
          {/* Info Footer for Browser */}
          <div className="h-6 bg-zinc-900 border-t border-black flex items-center px-2 text-[9px] text-zinc-600 font-mono">
              {/* {Object.keys(MOCK_LOOPS).length} ITEMS // READY */}
          </div>
        </div>

        {/* Workspace */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#121214]">
            {/* Top Rack for AI */}
            <div className="p-4 border-b border-zinc-800 bg-[#18181b] shadow-lg z-10">
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
