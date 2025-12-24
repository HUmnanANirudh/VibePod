"use client";

import React, { useState } from 'react';
import { Wand2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAudioStore } from '@/store/useAudioStore';
import { ProjectSchema } from '@/lib/schema';
import { toast } from 'sonner';

export function AIPrompt() {
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const { setProject, resetProject } = useAudioStore();

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        setLoading(true);
        try {
            const res = await fetch('/api/ai/arrange', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt })
            });
            
            if (!res.ok) throw new Error('Generation failed');
            
            const data = await res.json();
            // Validate
            const project = ProjectSchema.parse(data);
            
            // Reset and Load
            resetProject();
            // Small delay to allow reset to propagate if needed (though sync is fine)
            setTimeout(() => {
                setProject(project);
                toast.success("Project generated!");
            }, 100);

        } catch (err) {
            console.error(err);
            toast.error("Failed to generate project");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleGenerate} className="flex items-center gap-2 w-full max-w-lg mx-auto transform transition-all focus-within:scale-105">
            <div className="relative flex-1">
                <Input 
                    placeholder="Describe your vibe (e.g. 'Chill lofi study beat')" 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="pl-4 pr-10 shadow-lg border-primary/20 bg-background/80 backdrop-blur"
                />
                <Wand2 className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
            </div>
            <Button type="submit" disabled={loading} className="shadow-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0">
                {loading ? <Loader2 className="animate-spin" /> : "Generate"}
            </Button>
        </form>
    );
}
