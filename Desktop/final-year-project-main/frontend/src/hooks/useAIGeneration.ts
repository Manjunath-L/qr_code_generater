import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface AIGenerationOptions {
  complexity?: 'simple' | 'medium' | 'complex' | 'comprehensive';
  style?: 'standard' | 'professional' | 'creative' | 'minimal';
}

export function useAIGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  
  const generateDiagram = async (
    type: 'mindmap' | 'flowchart', 
    prompt: string, 
    options?: AIGenerationOptions
  ) => {
    if (!prompt.trim()) {
      toast({
        title: 'Input required',
        description: 'Please enter a description or concepts to generate a diagram.',
        variant: 'destructive',
      });
      return null;
    }

    setIsGenerating(true);

    try {
      const response = await apiRequest('POST', '/api/generate', {
        type,
        prompt,
        options: options || {
          complexity: 'medium',
          style: 'standard'
        }
      });

      const data = await response.json();
      
      toast({
        title: 'Generation complete',
        description: `Your ${type} has been generated successfully.`,
      });
      
      return data;
    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: 'Generation failed',
        description: 'Unable to generate diagram. Please try again.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };
  
  return {
    generateDiagram,
    isGenerating
  };
}
