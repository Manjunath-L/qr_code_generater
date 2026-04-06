import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

interface NodeProps {
  id: string;
  text: string;
  children?: string[] | null;
  shape?: string;
}

interface NodePropertiesProps {
  node: NodeProps;
  onUpdateProperty: (property: string, value: any) => void;
  onDelete?: (nodeId: string) => void;
}

export default function NodeProperties({ node, onUpdateProperty, onDelete }: NodePropertiesProps) {
  const [text, setText] = useState(node.text);
  const [isExpanded, setIsExpanded] = useState(true);
  
  // Update the text state when the selected node changes
  useEffect(() => {
    setText(node.text);
  }, [node.id, node.text]);
  
  // Handle text change and update after a short delay
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };
  
  // Update the node property when text input loses focus
  const handleTextBlur = () => {
    onUpdateProperty('text', text);
  };
  
  // Toggle properties panel expansion
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  
  // Handle node deletion
  const handleDelete = () => {
    if (onDelete) {
      onDelete(node.id);
    }
  };
  
  return (
    <div 
      className="border-l border-neutral-200 bg-white overflow-hidden transition-all duration-300 ease-in-out flex flex-col"
      style={{ 
        width: isExpanded ? 'clamp(250px, 20vw, 300px)' : '40px',
        minWidth: isExpanded ? '200px' : '40px',
      }}
    >
      {/* Header with toggle button */}
      <div className="flex items-center justify-between p-3 border-b border-neutral-200 sticky top-0 bg-white z-10">
        {isExpanded ? (
          <h3 className="font-medium text-neutral-800">Properties</h3>
        ) : (
          <span className="material-icons text-neutral-600 mx-auto rotate-90">tune</span>
        )}
        
        <button
          onClick={toggleExpand}
          className="flex-shrink-0 text-neutral-500 hover:text-neutral-700 focus:outline-none"
        >
          <span className="material-icons text-lg">
            {isExpanded ? 'chevron_right' : 'chevron_left'}
          </span>
        </button>
      </div>
      
      {isExpanded && (
        <div className="p-4 overflow-y-auto flex-1">
          <Tabs defaultValue="general">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="general" className="flex-1">General</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="space-y-4">
              <div>
                <Label className="block text-sm font-medium text-neutral-700 mb-1">Text</Label>
                <Input
                  type="text"
                  value={text}
                  onChange={handleTextChange}
                  onBlur={handleTextBlur}
                  className="w-full"
                />
              </div>

              {onDelete && (
                <div className="pt-4 border-t border-neutral-200">
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={handleDelete}
                  >
                    Delete Node
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
