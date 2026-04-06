import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { DiagramType, diagramTypeSchema } from '@shared/schema';

interface AIGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (data: any) => void;
}

export default function AIGeneratorModal({
  isOpen,
  onClose,
  onGenerate,
}: AIGeneratorModalProps) {
  const [diagramType, setDiagramType] = useState<DiagramType>('mindmap');
  const [prompt, setPrompt] = useState('');
  const [complexity, setComplexity] = useState('medium');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const examplePrompts = {
    mindmap: [
      'Create a mind map about digital marketing strategies',
      'Make a mind map for project JavaScript OOP Concept'
    ],
    flowchart: [
      'Generate a flowchart for user authentication process',
      'Create a flowchart for e-commerce checkout process'
    ]
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: 'Input required',
        description: 'Please enter a description or concepts to generate a diagram.',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);

    try {
      console.log('Generating diagram:', {
        type: diagramType,
        prompt: prompt,
        options: { complexity }
      });
      
      const response = await apiRequest('POST', '/api/generate', {
        type: diagramType,
        prompt,
        options: {
          complexity
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Generation API error:', errorData);
        throw new Error(errorData.message || 'Server error during diagram generation');
      }

      const data = await response.json();
      
      // Validate the structure based on diagram type
      if (diagramType === 'mindmap' && (!data.rootId || !data.nodes)) {
        console.error('Invalid mind map structure:', data);
        throw new Error('The generated mind map has an invalid structure');
      }
      
      if (diagramType === 'flowchart' && (!Array.isArray(data.nodes) || !Array.isArray(data.edges))) {
        console.error('Invalid flowchart structure:', data);
        throw new Error('The generated flowchart has an invalid structure');
      }
      
      console.log('Generation successful:', data);
      onGenerate(data);
      onClose();

      toast({
        title: 'Generation complete',
        description: `Your ${diagramType} has been generated successfully.`,
      });
    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: 'Generation failed',
        description: error instanceof Error ? error.message : 'Unable to generate diagram. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseExamplePrompt = (example: string) => {
    setPrompt(example);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-neutral-800">Diagram Generator</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-2">
          {/* Diagram Type Selection */}
          <div className="mb-6">
            <Label className="block text-sm font-medium text-neutral-700 mb-2">Diagram Type</Label>
            <RadioGroup value={diagramType} onValueChange={(value) => setDiagramType(diagramTypeSchema.parse(value))} className="grid grid-cols-2 gap-4">
              <div className="relative">
                <RadioGroupItem value="mindmap" id="mindmap-type" className="sr-only" />
                <Label 
                  htmlFor="mindmap-type" 
                  className={`flex flex-col items-center p-4 border-2 ${diagramType === 'mindmap' ? 'border-primary-500 bg-primary-50' : 'border-neutral-200'} rounded-lg cursor-pointer ${diagramType !== 'mindmap' && 'hover:bg-neutral-50'}`}
                >
                  <span className={`material-icons ${diagramType === 'mindmap' ? 'text-primary-500' : 'text-neutral-500'} text-2xl mb-2`}>share</span>
                  <span className={`font-medium ${diagramType === 'mindmap' ? 'text-primary-600' : ''}`}>Mind Map</span>
                  <span className="text-xs text-neutral-500 mt-1">From text or concepts</span>
                </Label>
              </div>
              
              <div className="relative">
                <RadioGroupItem value="flowchart" id="flowchart-type" className="sr-only" />
                <Label 
                  htmlFor="flowchart-type" 
                  className={`flex flex-col items-center p-4 border-2 ${diagramType === 'flowchart' ? 'border-primary-500 bg-primary-50' : 'border-neutral-200'} rounded-lg cursor-pointer ${diagramType !== 'flowchart' && 'hover:bg-neutral-50'}`}
                >
                  <span className={`material-icons ${diagramType === 'flowchart' ? 'text-primary-500' : 'text-neutral-500'} text-2xl mb-2`}>account_tree</span>
                  <span className={`font-medium ${diagramType === 'flowchart' ? 'text-primary-600' : ''}`}>Flowchart</span>
                  <span className="text-xs text-neutral-500 mt-1">From processes or code</span>
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          {/* Input Area */}
          <div className="mb-6">
            <Label className="block text-sm font-medium text-neutral-700 mb-2">
              Description or Concepts
            </Label>
            <Textarea
              rows={6}
              placeholder={`Enter ${diagramType === 'mindmap' ? 'concepts, ideas or a description' : 'a process description or code'} to generate a ${diagramType}...`}
              className="w-full"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <p className="mt-2 text-xs text-neutral-500">
              For best results, provide clear {diagramType === 'mindmap' ? 'concepts' : 'steps'} or a detailed description of the {diagramType === 'mindmap' ? 'topic' : 'process'} you want to visualize.
            </p>
          </div>
          
          {/* Example Prompts */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-neutral-700 mb-2">Example Prompts</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {examplePrompts[diagramType].map((example, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="text-left justify-start h-auto px-3 py-2 text-sm"
                  onClick={() => handleUseExamplePrompt(example)}
                >
                  {example}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Options */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-neutral-700 mb-2">Options</h3>
            <div>
              <Label className="block text-sm text-neutral-600 mb-1">Complexity Level</Label>
              <Select value={complexity} onValueChange={setComplexity}>
                <SelectTrigger>
                  <SelectValue placeholder="Select complexity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="simple">Simple (3-5 nodes)</SelectItem>
                  <SelectItem value="medium">Medium (5-10 nodes)</SelectItem>
                  <SelectItem value="complex">Complex (10-15 nodes)</SelectItem>
                  <SelectItem value="comprehensive">Comprehensive (15+ nodes)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose} disabled={isGenerating}>
            Cancel
          </Button>
          <Button onClick={handleGenerate} disabled={isGenerating}>
            {isGenerating ? 'Generating...' : 'Generate Diagram'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
