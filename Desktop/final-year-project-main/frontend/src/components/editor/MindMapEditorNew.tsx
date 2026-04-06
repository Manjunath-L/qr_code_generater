import { useCallback, useState, useRef } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  Node,
  Edge,
  OnConnectEnd,
  OnConnectStart,
  NodeOrigin,
  ReactFlowProvider,
  useReactFlow,
  Panel,
  ConnectionLineType,
  MarkerType,
  type NodeTypes,
  type EdgeTypes,
  getNodesBounds,
  getViewportForBounds,
} from '@xyflow/react';
import { toPng } from 'html-to-image';
import '@xyflow/react/dist/style.css';
import './mindmap.css';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

// Import components and store
import useMindMapStore from './MindMapStore';
import MindMapNode from './MindMapNode';
import MindMapEdge from './MindMapEdge';
import NodeProperties from './NodeProperties';

// Define types for mind map data structure
interface MindMapNodeData {
  label: string;
  [key: string]: unknown;
}

interface MindMapNode {
  id: string;
  text: string;
  children: string[];
}

interface MindMapData {
  rootId: string;
  nodes: Record<string, MindMapNode>;
}

interface MindMapEditorProps {
  initialData?: MindMapData;
  onSave?: (data: MindMapData) => void;
}

// Select only what we need from the store
const selector = (state: any) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  addChildNode: state.addChildNode,
  deleteNode: state.deleteNode,
  getNodeTree: state.getNodeTree,
});

// Node types configuration
const nodeTypes: NodeTypes = {
  mindMapNode: MindMapNode
};

// Edge types configuration
const edgeTypes: EdgeTypes = {
  mindMapEdge: MindMapEdge
};

// Connection line and edge styling
const connectionLineStyle = { stroke: '#F6AD55', strokeWidth: 2 };
const defaultEdgeOptions = { 
  style: { 
    stroke: '#F6AD55', 
    strokeWidth: 2
  }, 
  type: 'mindMapEdge',
  markerEnd: MarkerType.ArrowClosed
};
const nodeOrigin: NodeOrigin = [0.5, 0.5];

// Define image dimensions for download (adjust as needed)
const imageWidth = 1920;
const imageHeight = 1080;

// Convert from MindMapData to ReactFlow format
const convertToReactFlow = (data: MindMapData): { nodes: Node[], edges: Edge[] } => {
  const nodeMap = new Map<string, { x: number; y: number; level: number }>();
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Constants for layout
  const LEVEL_SPACING = 300; // Horizontal spacing between levels
  const NODE_SPACING = 150;  // Vertical spacing between nodes
  const TOP_ANGLE = Math.PI / 3; // 60 degrees for top section

  // Start with root node at center
  const rootNode = data.nodes[data.rootId];
  nodeMap.set(rootNode.id, { x: 0, y: 0, level: 0 });

  // Get all nodes by level
  const getChildrenByLevel = (nodeId: string, level: number = 0): Record<number, string[]> => {
    const result: Record<number, string[]> = {};
    const node = data.nodes[nodeId];
    
    if (!node) return result;
    
    if (!result[level]) {
      result[level] = [];
    }
    
    result[level].push(nodeId);
    
    if (node.children && Array.isArray(node.children)) {
      node.children.forEach(childId => {
        const childResults = getChildrenByLevel(childId, level + 1);
        Object.keys(childResults).forEach(lvl => {
          const intLevel = parseInt(lvl);
          if (!result[intLevel]) {
            result[intLevel] = [];
          }
          result[intLevel] = [...result[intLevel], ...childResults[intLevel]];
        });
      });
    }
    
    return result;
  };

  // Get nodes organized by level
  const nodesByLevel = getChildrenByLevel(rootNode.id);
  const maxLevel = Math.max(...Object.keys(nodesByLevel).map(Number));

  // Position nodes level by level
  Object.entries(nodesByLevel).forEach(([levelStr, levelNodes]) => {
    const level = parseInt(levelStr);
    const nodeCount = levelNodes.length;
    
    levelNodes.forEach((nodeId, index) => {
      const node = data.nodes[nodeId];
      const parentNode = Object.values(data.nodes).find(n => n.children?.includes(nodeId));
      const parentPos = parentNode ? nodeMap.get(parentNode.id) : null;
      
      let x = 0;
      let y = 0;
      
      if (level === 0) {
        // Root node at center
        x = 0;
        y = 0;
      } else if (level === 1) {
        // First level nodes - arrange in a semi-circle on top and sides
        const totalAngle = 2 * Math.PI - TOP_ANGLE; // Leave space at the bottom
        const angleStep = totalAngle / (nodeCount + 1);
        const angle = -Math.PI / 2 - TOP_ANGLE / 2 + angleStep * (index + 1);
        const radius = LEVEL_SPACING;
        
        x = Math.cos(angle) * radius;
        y = Math.sin(angle) * radius;
      } else {
        // Deeper level nodes
        if (parentPos) {
          const parentAngle = Math.atan2(parentPos.y, parentPos.x);
          const radius = level * LEVEL_SPACING;
          const spreadAngle = Math.PI / 6; // 30 degrees spread
          const nodeAngle = parentAngle - spreadAngle/2 + (spreadAngle * index)/(nodeCount-1 || 1);
          
          x = Math.cos(nodeAngle) * radius;
          y = Math.sin(nodeAngle) * radius;
          
          // Adjust position to prevent overlaps
          const siblings = levelNodes.filter(id => {
            const siblingParent = Object.values(data.nodes).find(n => n.children?.includes(id));
            return siblingParent?.id === parentNode?.id;
          });
          const siblingIndex = siblings.indexOf(nodeId);
          const totalSiblings = siblings.length;
          
          if (totalSiblings > 1) {
            const offset = (siblingIndex - (totalSiblings - 1) / 2) * NODE_SPACING;
            const perpX = -Math.sin(nodeAngle) * offset;
            const perpY = Math.cos(nodeAngle) * offset;
            x += perpX;
            y += perpY;
          }
        }
      }
      
      nodeMap.set(nodeId, { x, y, level });
    });
  });

  // Create nodes and edges
  Object.keys(data.nodes).forEach(nodeId => {
    const node = data.nodes[nodeId];
    const pos = nodeMap.get(nodeId);
    
    if (pos) {
      nodes.push({
        id: nodeId,
        type: 'mindMapNode',
        position: { x: pos.x, y: pos.y },
        data: { label: node.text },
      });

      node.children?.forEach(childId => {
        edges.push({
          id: `${nodeId}-${childId}`,
          source: nodeId,
          target: childId,
          type: 'mindMapEdge',
        });
      });
    }
  });

  return { nodes, edges };
};

// Implementation for MindMapEditor with Zustand store
function MindMapEditorContent({ initialData, onSave }: MindMapEditorProps) {
  const { toast } = useToast();
  const { getNodes } = useReactFlow();
  
  // Use our store with the selector
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    addChildNode,
    deleteNode,
    getNodeTree
  } = useMindMapStore(state => selector(state));

  // Flow instance and store API for advanced operations
  const connectingNodeId = useRef<string | null>(null);
  const reactFlowInstance = useReactFlow();
  const [selectedNode, setSelectedNode] = useState<Node<MindMapNodeData> | null>(null);

  // Start connecting from a node
  const onConnectStart: OnConnectStart = useCallback((_, { nodeId }) => {
    connectingNodeId.current = nodeId;
  }, []);

  // Connect end - create a new node when dragging to empty space
  const onConnectEnd: OnConnectEnd = useCallback(
    (event) => {
      if (!connectingNodeId.current) return;

      // Get the coordinates of the mouse event
      const targetIsPane = (event.target as Element).classList.contains('react-flow__pane');
      if (!targetIsPane) return;

      // Calculate position in flow
      const { top, left } = (document.querySelector('.react-flow__renderer') as HTMLElement).getBoundingClientRect();
      const mouseX = 'clientX' in event ? event.clientX : event.touches?.[0].clientX || 0;
      const mouseY = 'clientY' in event ? event.clientY : event.touches?.[0].clientY || 0;
      
      // Project mouse position to flow position
      const position = reactFlowInstance.screenToFlowPosition({
        x: mouseX - left,
        y: mouseY - top,
      });

      // Find the parent node
      const parentNode = nodes.find((node: Node) => node.id === connectingNodeId.current);
      if (!parentNode) return;

      // Add the new node
      addChildNode(parentNode, position);
      connectingNodeId.current = null;
    },
    [nodes, addChildNode, reactFlowInstance]
  );

  // Handle save action
  const handleSave = () => {
    if (onSave) {
      const data = getNodeTree();
      onSave(data);
      toast({
        title: 'Saved',
        description: 'Mind map saved successfully!',
      });
    }
  };

  // Auto arrange nodes
  const handleAutoLayout = () => {
    // Always use the current node tree from the store
    const data = getNodeTree();
    
    // Check if we have valid data to lay out
    if (!data || !data.rootId || !data.nodes || Object.keys(data.nodes).length === 0) {
      toast({
        title: 'Layout Failed',
        description: 'Could not apply layout. No valid mind map data found.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      // Generate new layout with properly positioned nodes
      const { nodes: layoutNodes, edges: layoutEdges } = convertToReactFlow(data);
      
      // Update the store with the new layout
      useMindMapStore.setState({ nodes: layoutNodes, edges: layoutEdges });
      
      // Give visual feedback
      toast({
        title: 'Layout Applied',
        description: 'Mind map has been auto-arranged',
      });
      
      // Fit the view to show all nodes
      setTimeout(() => {
        reactFlowInstance.fitView({ padding: 0.2, includeHiddenNodes: false });
      }, 50);
    } catch (error) {
      console.error('Error applying auto layout:', error);
      toast({
        title: 'Layout Failed',
        description: 'An error occurred while arranging the mind map.',
        variant: 'destructive',
      });
    }
  };

  // Handle node selection
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node as Node<MindMapNodeData>);
  }, []);

  // Handle node deletion
  const handleDeleteNode = useCallback((nodeId: string) => {
    deleteNode(nodeId);
    setSelectedNode(null);
    toast({
      title: 'Node Deleted',
      description: 'The node and its children have been removed',
    });
  }, [deleteNode, toast]);

  // Handle download action - Updated to capture entire flow and use correct function names
  const handleDownload = useCallback(async () => {
    const flowViewport = document.querySelector('.react-flow__viewport');
    if (!flowViewport) {
      toast({
        title: 'Error',
        description: 'Could not find the mind map viewport element.',
        variant: 'destructive',
      });
      return;
    }

    // Use correct function name: getNodesBounds
    const nodesBounds = getNodesBounds(getNodes()); 
    // Use correct function name: getViewportForBounds
    const viewport = getViewportForBounds(
      nodesBounds,
      imageWidth,
      imageHeight,
      0.5, // minZoom
      2,   // maxZoom
      0.1  // padding (optional, adjust as needed)
    );

    try {
      const dataUrl = await toPng(flowViewport as HTMLElement, {
        backgroundColor: '#ffffff',
        width: imageWidth,
        height: imageHeight,
        style: {
          width: `${imageWidth}px`,
          height: `${imageHeight}px`,
          // Use viewport properties for transform
          transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
        },
      });
      const link = document.createElement('a');
      link.download = 'mindmap.png';
      link.href = dataUrl;
      link.click();
      toast({
        title: 'Downloaded',
        description: 'Mind map downloaded as PNG.',
      });
    } catch (error) {
      console.error('Error downloading mind map:', error);
      toast({
        title: 'Download Failed',
        description: 'Could not generate PNG image.',
        variant: 'destructive',
      });
    }
  }, [getNodes, toast]);

  return (
      <div className="flex-1 border rounded-md mindmap-container flex flex-col">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-2 p-2 border-b">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleAutoLayout}
            >
              <span className="material-icons text-sm mr-1">auto_fix_high</span>
              Auto Layout
            </Button>
          </div>
          <Button
            onClick={handleSave}
            size="sm"
            className="ml-auto"
          >
            <span className="material-icons text-sm mr-1">save</span>
            Save
          </Button>
        </div>

        <div className="flex-1 flex">
          <div className="flex-1">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              onConnectStart={onConnectStart}
              onConnectEnd={onConnectEnd}
              onNodeClick={onNodeClick}
              connectionLineStyle={connectionLineStyle}
              defaultEdgeOptions={defaultEdgeOptions}
              connectionLineType={ConnectionLineType.SmoothStep}
              nodeOrigin={nodeOrigin}
              fitView
              minZoom={0.5}
              maxZoom={1.5}
              className="mindmap-flow"
            >
              <Background color="#f8f8f8" gap={16} />
              <Controls showInteractive={false} />
              <Panel position="top-right">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  className="shadow-md"
                >
                  <span className="material-icons text-sm mr-1">download</span>
                  Download PNG
                </Button>
              </Panel>
            </ReactFlow>
          </div>

          {selectedNode && (
            <NodeProperties
              node={{
                id: selectedNode.id,
                text: selectedNode.data.label,
                shape: selectedNode.type,
              }}
              onUpdateProperty={(property, value) => {
                // Handle property updates
                if (property === 'text') {
                  selectedNode.data.label = value;
                } else if (property === 'shape') {
                  selectedNode.type = value;
                }
                
                // Notify React Flow about the change
                // Ensure you only update properties that exist now
                onNodesChange([{ type: 'change', id: selectedNode.id, data: { label: selectedNode.data.label } }]); // Only update relevant data
              }}
              onDelete={handleDeleteNode}
            />
          )}
        </div>
      </div>
  );
}

// Wrapper with ReactFlowProvider
export default function MindMapEditorNew(props: MindMapEditorProps) {
  // Load initial data on mount
  useState(() => {
    if (props.initialData) {
      const { nodes, edges } = convertToReactFlow(props.initialData);
      useMindMapStore.setState({ nodes, edges });
    }
  });

  return (
    <ReactFlowProvider>
      <MindMapEditorContent {...props} />
    </ReactFlowProvider>
  );
}