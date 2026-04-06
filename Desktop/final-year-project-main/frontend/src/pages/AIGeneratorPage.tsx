import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import AIGeneratorModal from '@/components/editor/AIGeneratorModal';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

export default function AIGeneratorPage() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(true);
  
  // Handle generated data
  const handleGenerate = async (data: any) => {
    try {
      // First determine if it's a mindmap or flowchart based on data structure
      const isMindMap = data.rootId && data.nodes;
      const isFlowchart = Array.isArray(data.nodes) && Array.isArray(data.edges);
      
      if (!isMindMap && !isFlowchart) {
        console.error('Invalid data structure:', data);
        throw new Error('Invalid diagram data structure');
      }

      // For flowcharts, ensure all nodes have required properties
      if (isFlowchart) {
        const validatedNodes = data.nodes.map((node: any) => ({
          ...node,
          data: {
            label: node.data?.label || node.label || 'Unnamed Node',
            ...node.data
          },
          position: node.position || { x: 0, y: 0 },
          type: node.type || 'default'
        }));

        const validatedEdges = data.edges.map((edge: any) => ({
          ...edge,
          id: edge.id || `e${edge.source}-${edge.target}`,
          animated: false
        }));

        data = {
          nodes: validatedNodes,
          edges: validatedEdges
        };
      }
      
      // Create a new project with the generated data
      const response = await apiRequest('POST', '/api/projects', {
        name: 'AI Generated ' + (isMindMap ? 'Mind Map' : 'Flowchart'),
        type: isMindMap ? 'mindmap' : 'flowchart',
        data,
        userId: 1 // Default user ID for demo
      });
      
      const result = await response.json();
      
      if (!result.id) {
        throw new Error('Invalid project response');
      }
      
      // Navigate to the appropriate editor
      if (isMindMap) {
        setLocation(`/mindmap/${result.id}`);
      } else {
        setLocation(`/flowchart/${result.id}`);
      }

      toast({
        title: 'Success',
        description: `Generated ${isMindMap ? 'mind map' : 'flowchart'} created successfully`,
      });
      
    } catch (error) {
      console.error('Error creating project from AI generated data:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create project from AI generated data',
        variant: 'destructive',
      });
      setLocation('/');
    }
  };
  
  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setLocation('/');
  };
  
  return (
    <div className="flex-1 flex items-center justify-center bg-neutral-50">
      <AIGeneratorModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onGenerate={handleGenerate}
      />
    </div>
  );
}
