import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import FlowchartEditor from '@/components/editor/FlowchartEditor';
import { Node, Edge } from 'reactflow';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';
import html2canvas from 'html2canvas';

interface FlowchartPageProps {
  id?: string;
  setProjectName: (name: string) => void;
}

interface FlowchartData {
  nodes: Node[];
  edges: Edge[];
}

interface Project {
  id: number;
  name: string;
  type: 'mindmap' | 'flowchart';
  data: FlowchartData;
  thumbnail?: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function FlowchartPage({ id, setProjectName }: FlowchartPageProps) {
  const { toast } = useToast();
  const [flowchartData, setFlowchartData] = useState<FlowchartData | undefined>(undefined);
  
  // Get URL parameters for template data
  const params = new URLSearchParams(window.location.search);
  const templateData = params.get('data');
  const templateName = params.get('name');
  
  // Fetch project data if id is provided
  const { data: project, isLoading } = useQuery<Project>({
    queryKey: id ? [`/api/projects/${id}`] : ['/api/dummy-key'],
    enabled: !!id,
  });
  
  // Set project data and name when loaded
  useEffect(() => {
    if (project) {
      setProjectName(project.name);
      setFlowchartData(project.data);
    } else if (templateData) {
      // If template data is provided in URL, use it
      try {
        const parsedData = JSON.parse(templateData);
        setFlowchartData(parsedData);
        if (templateName) {
          setProjectName(templateName);
        } else {
          setProjectName('Untitled Flowchart');
        }
      } catch (error) {
        console.error('Error parsing template data:', error);
        setDefaultFlowchart();
      }
    } else if (!id) {
      // New project with default data
      setDefaultFlowchart();
    }
  }, [project, id, setProjectName, templateData, templateName]);

  // Helper to set default flowchart data
  const setDefaultFlowchart = () => {
    setProjectName('Untitled Flowchart');
    setFlowchartData({
      nodes: [
        { id: '1', type: 'input', data: { label: 'Start' }, position: { x: 250, y: 0 } }
      ],
      edges: []
    });
  };

  // Handle save functionality
  const handleSave = async (nodes: Node[], edges: Edge[]) => {
    try {
      // Validate data structure before saving
      if (!Array.isArray(nodes) || !Array.isArray(edges)) {
        throw new Error('Invalid flowchart data structure');
      }

      // Validate nodes and edges
      const data = { 
        nodes: nodes.map(node => ({
          ...node,
          data: {
            label: node.data?.label || 'Unnamed Node',
            ...node.data
          }
        })),
        edges: edges.map(edge => ({
          ...edge,
          id: edge.id || `e${edge.source}-${edge.target}`,
          animated: false
        }))
      };

      // Create thumbnail
      const element = document.querySelector('.flowchart-canvas');
      let thumbnail = '';
      if (element) {
        const canvas = await html2canvas(element as HTMLElement);
        // Create a new canvas for compression
        const maxWidth = 800;
        const maxHeight = 600;
        const compressedCanvas = document.createElement('canvas');
        const ctx = compressedCanvas.getContext('2d');
        
        // Calculate new dimensions while maintaining aspect ratio
        let width = canvas.width;
        let height = canvas.height;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
        
        // Set canvas size and draw scaled image
        compressedCanvas.width = width;
        compressedCanvas.height = height;
        ctx?.drawImage(canvas, 0, 0, width, height);
        
        // Convert to compressed JPEG
        thumbnail = compressedCanvas.toDataURL('image/jpeg', 0.7);
      }

      if (id) {
        // Update existing project
        const response = await apiRequest('PUT', `/api/projects/${id}`, {
          data,
          thumbnail
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.details || errorData.message || 'Failed to save flowchart');
        }
      } else {
        // Create new project
        const response = await apiRequest('POST', '/api/projects', {
          name: templateName || 'Untitled Flowchart',
          type: 'flowchart',
          data,
          thumbnail
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.details || errorData.message || 'Failed to create flowchart');
        }
        
        const newProject = await response.json();
        // Redirect to the new project's URL
        window.history.pushState({}, '', `/flowchart/${newProject.id}`);
      }

      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      
      toast({
        title: 'Success',
        description: 'Flowchart saved successfully!',
      });
    } catch (error) {
      console.error('Error saving flowchart:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save flowchart',
        variant: 'destructive',
      });
    }
  };
  
  if (isLoading && id) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-700 mx-auto"></div>
          <p className="mt-2 text-neutral-600">Loading flowchart...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex-1 flex flex-col flowchart-canvas">
      {flowchartData && (
        <FlowchartEditor
          initialNodes={flowchartData.nodes}
          initialEdges={flowchartData.edges}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
