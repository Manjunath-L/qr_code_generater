import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import MindMapEditorNew from '@/components/editor/MindMapEditorNew';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';
import html2canvas from 'html2canvas';

interface MindMapPageProps {
  id?: string;
  setProjectName: (name: string) => void;
}

interface MindMapData {
  rootId: string;
  nodes: Record<string, any>;
}

interface Project {
  id: number;
  name: string;
  type: 'mindmap' | 'flowchart';
  data: MindMapData;
  thumbnail?: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function MindMapPage({ id, setProjectName }: MindMapPageProps) {
  const { toast } = useToast();
  const [mindMapData, setMindMapData] = useState<MindMapData | undefined>(undefined);
  
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
      setMindMapData(project.data);
    } else if (templateData) {
      // If template data is provided in URL, use it
      try {
        const parsedData = JSON.parse(templateData);
        setMindMapData(parsedData);
        if (templateName) {
          setProjectName(templateName);
        } else {
          setProjectName('Untitled Mind Map');
        }
      } catch (error) {
        console.error('Error parsing template data:', error);
        setDefaultMindMap();
      }
    } else if (!id) {
      // New project with default data
      setDefaultMindMap();
    }
  }, [project, id, setProjectName, templateData, templateName]);

  // Helper to set default mindmap data
  const setDefaultMindMap = () => {
    setProjectName('Untitled Mind Map');
    setMindMapData({
      rootId: '1',
      nodes: {
        '1': { id: '1', text: 'Central Idea', children: [] }
      }
    });
  };

  // Handle save functionality
  const handleSave = async (data: MindMapData) => {
    try {
      // Validate data structure before saving
      if (!data.rootId || !data.nodes || typeof data.nodes !== 'object') {
        throw new Error('Invalid mind map data structure');
      }

      // Create thumbnail with compression
      const element = document.querySelector('.mindmap-canvas') as HTMLElement;
      let thumbnail = '';
      if (element) {
        const canvas = await html2canvas(element);
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
          throw new Error(errorData.details || errorData.message || 'Failed to save mind map');
        }
      } else {
        // Create new project
        const response = await apiRequest('POST', '/api/projects', {
          name: templateName || 'Untitled Mind Map',
          type: 'mindmap',
          data,
          thumbnail
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.details || errorData.message || 'Failed to create mind map');
        }
        
        const newProject = await response.json();
        // Redirect to the new project's URL
        window.history.pushState({}, '', `/mindmap/${newProject.id}`);
      }

      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      
      toast({
        title: 'Success',
        description: 'Mind map saved successfully!',
      });
    } catch (error) {
      console.error('Error saving mind map:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save mind map',
        variant: 'destructive',
      });
    }
  };
  
  if (isLoading && id) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-700 mx-auto"></div>
          <p className="mt-2 text-neutral-600">Loading mind map...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex-1 flex flex-col mindmap-canvas">
      {mindMapData && (
        <MindMapEditorNew
          initialData={mindMapData}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
