"use client";

import React, { useState } from "react";
import { Wand2, Loader2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAudioStore } from "@/store/useAudioStore";
import { ProjectSchema } from "@/lib/schema";
import { toast } from "sonner";

interface AIPromptProps {
    downloadAudio?: (onProgress?: (percent: number) => void) => Promise<void>;
}

export function AIPrompt({ downloadAudio }: AIPromptProps) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const { project, setProject, resetProject, addSavedProject } = useAudioStore();

  // Effect to lock if project exists (e.g. loaded from history)
  React.useEffect(() => {
    if (project && project.tracks.length > 0) {
      setIsLocked(true);
    } else {
        setIsLocked(false);
    }
  }, [project]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/ai/arrange", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Generation failed");
      }

      const data = await res.json();
      const newProject = ProjectSchema.parse(data);
      
      resetProject();
      setTimeout(async () => {
        setProject(newProject);
        setIsLocked(true);
        toast.success("Project generated!");
        
        // Auto-save to database
        try {
            const saveRes = await fetch("/api/projects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    name: prompt, 
                    prompt: prompt,
                    data: newProject 
                }),
            });
            if (saveRes.ok) {
                const savedProject = await saveRes.json();
                addSavedProject(savedProject);
                toast.success("Project saved to library");
            } else {
                toast.error("Failed to save project to library");
            }
        } catch (saveErr) {
            console.error("Failed to save project", saveErr);
            toast.error("Failed to save project to library");
        }

      }, 100);
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate project");
    } finally {
      setLoading(false);
    }
  };

  const handleNewProject = () => {
      resetProject();
      setPrompt("");
      setIsLocked(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-zinc-900 rounded-sm border-x-4 border-zinc-800 shadow-2xl overflow-hidden relative">
      <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-zinc-700 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.8)] flex items-center justify-center">
        <div className="w-1.5 h-0.5 bg-zinc-900 rotate-45"></div>
      </div>
      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-zinc-700 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.8)] flex items-center justify-center">
        <div className="w-1.5 h-0.5 bg-zinc-900 rotate-45"></div>
      </div>
      <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-zinc-700 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.8)] flex items-center justify-center">
        <div className="w-1.5 h-0.5 bg-zinc-900 rotate-45"></div>
      </div>
      <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-zinc-700 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.8)] flex items-center justify-center">
        <div className="w-1.5 h-0.5 bg-zinc-900 rotate-45"></div>
      </div>

      <div className="bg-zinc-800 p-1 border-b border-white/5 flex items-center justify-between px-4">
        <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
          AI Orchestrator Module // V1.0
        </span>
        <div className="flex gap-1">
          <div className={`w-1 h-1 rounded-full animate-pulse shadow-[0_0_4px_rgba(34,197,94,0.8)] ${isLocked ? 'bg-red-500' : 'bg-green-500'}`}></div>
          <div className="w-1 h-1 bg-zinc-600 rounded-full"></div>
          <div className="w-1 h-1 bg-zinc-600 rounded-full"></div>
        </div>
      </div>

      <form
        onSubmit={handleGenerate}
        className="flex bg-black p-4 gap-4 items-center relative"
      >
        <div className="absolute inset-0 pointer-events-none bg-linear-to-br from-white/5 to-transparent z-10"></div>

        <div className="flex-1 relative">
          <Wand2 className={`absolute left-3 top-3.5 h-5 w-5 ${isLocked ? 'text-zinc-600' : 'text-cyan-500/50'}`} />
          <Input
            placeholder={isLocked ? "System Locked. Project Active." : "CMD: Generate track..."}
            value={prompt}
            disabled={isLocked}
            onChange={(e) => setPrompt(e.target.value)}
            className={`pl-10 bg-zinc-950 border-zinc-800 font-mono text-sm h-12 rounded-sm focus-visible:ring-1 shadow-[inset_0_2px_8px_rgba(0,0,0,1)] uppercase disabled:opacity-50 disabled:cursor-not-allowed ${isLocked ? 'text-zinc-500 border-zinc-900' : 'text-cyan-400 placeholder:text-cyan-900 focus-visible:ring-cyan-500'}`}
          />
        </div>

        {isLocked ? (
             <>
                <Button
                    type="button"
                    disabled={downloading}
                    onClick={async () => {
                        if (downloadAudio) {
                            setDownloading(true);
                            setDownloadProgress(0);
                            try {
                                await downloadAudio((percent) => {
                                    setDownloadProgress(Math.round(percent));
                                });
                                toast.success('Audio downloaded!');
                            } catch (err) {
                                toast.error('Failed to download audio');
                            } finally {
                                setDownloading(false);
                                setDownloadProgress(0);
                            }
                        } else {
                            toast.error("Audio download not available");
                        }
                    }}
                    className="h-12 w-32 rounded-sm bg-zinc-900 border-2 border-zinc-800 text-zinc-400 hover:text-green-400 hover:border-green-500 shadow-[2px_2px_0_rgba(0,0,0,0.5)] active:translate-y-0.5 active:shadow-none transition-all font-mono font-bold tracking-tighter disabled:opacity-50"
                >
                    {downloading ? (
                        <span className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            {downloadProgress}%
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            <Download className="h-4 w-4" />
                            EXPORT
                        </span>
                    )}
                </Button>
                <Button
                    type="button"
                    onClick={handleNewProject}
                    disabled={downloading}
                    className="h-12 w-32 rounded-sm bg-red-950/30 border-2 border-red-900/50 text-red-500 hover:bg-red-900/50 hover:border-red-500 shadow-[2px_2px_0_rgba(0,0,0,0.5)] active:translate-y-0.5 active:shadow-none transition-all font-mono font-bold tracking-tighter disabled:opacity-50"
                >
                    NEW PROJECT
                </Button>
             </>
        ) : (
            <Button
            type="submit"
            disabled={loading}
            className="h-12 w-32 rounded-sm bg-zinc-800 border-2 border-zinc-700 text-zinc-400 hover:text-cyan-400 hover:border-cyan-500 hover:bg-zinc-900 shadow-[2px_2px_0_rgba(0,0,0,0.5)] active:translate-y-0.5 active:shadow-none transition-all font-mono font-bold tracking-tighter"
            >
            {loading ? (
                <Loader2 className="animate-spin text-cyan-500" />
            ) : (
                "EXECUTE"
            )}
            </Button>
        )}
      </form>
    </div>
  );
}
