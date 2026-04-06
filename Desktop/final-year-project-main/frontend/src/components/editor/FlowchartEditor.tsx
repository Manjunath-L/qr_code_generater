import { useCallback, useState, useRef } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  Connection,
  NodeTypes,
  EdgeTypes,
  MarkerType,
  Panel,
  ReactFlowProvider,
  useReactFlow,
  getNodesBounds,
  getViewportForBounds,
} from 'reactflow';
import { toPng } from 'html-to-image';
import 'reactflow/dist/style.css';
import NodeProperties from './NodeProperties';
import { Button } from "@/components/ui/button";
import FlowchartSymbolPalette from './FlowchartSymbolPalette';
import { nodeTypes } from './FlowchartNodes';
import { useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';


interface FlowchartEditorProps {
  initialNodes?: Node[];
  initialEdges?: Edge[];
  onSave?: (nodes: Node[], edges: Edge[]) => void;
}

const defaultNodes: Node[] = [
  {
    id: '1',
    type: 'terminal',
    data: { label: 'Start', color: '#90EE90' },
    position: { x: 250, y: 5 },
  },
  {
    id: '2',
    type: 'process',
    data: { label: 'Process Step', color: '#ADD8E6' },
    position: { x: 250, y: 100 },
  },
  {
    id: '3',
    type: 'terminal',
    data: { label: 'End', color: '#FFB6C1' },
    position: { x: 250, y: 200 },
  },
];

const defaultEdges: Edge[] = [
  { 
    id: 'e1-2', 
    source: '1', 
    target: '2', 
    type: 'default',
    animated: false,
    style: { stroke: '#555', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed }
  },
  { 
    id: 'e2-3', 
    source: '2', 
    target: '3', 
    type: 'default',
    animated: false,
    style: { stroke: '#555', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed }
  },
];

// Define image dimensions for download (adjust as needed)
const imageWidth = 1920;
const imageHeight = 1080;

// Export default wrapper component that provides ReactFlow context
export default function FlowchartEditor(props: FlowchartEditorProps) {
  return (
    <ReactFlowProvider>
      <FlowchartEditorContent {...props} />
    </ReactFlowProvider>
  );
}

// Inner component with access to React Flow hooks
function FlowchartEditorContent({ 
  initialNodes = defaultNodes, 
  initialEdges = defaultEdges,
  onSave
}: FlowchartEditorProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const reactFlowInstance = useReactFlow();
  
  // Memoize nodeTypes to prevent recreating it on each render
  const memoizedNodeTypes = useMemo(() => nodeTypes, []);

  // Add edge when a connection is created
  const onConnect = useCallback(
    (params: Connection) => {
      const edge = {
        ...params,
        type: 'default',
        animated: false,
        style: { stroke: '#666', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed },
        labelStyle: { fill: '#666', fontWeight: 700 }
      };
      setEdges((eds) => addEdge(edge, eds));
    },
    [setEdges],
  );

  // Handle node selection
  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  };

  // Handle background click to deselect node
  const onPaneClick = () => {
    setSelectedNode(null);
  };

  // Update node properties
  const updateNodeProperty = (property: string, value: any) => {
    if (!selectedNode) return;

    setNodes(nds => {
      return nds.map(node => {
        if (node.id === selectedNode.id) {
          if (property === 'text') {
            // Update label in data object
            return {
              ...node,
              data: {
                ...node.data,
                label: value
              }
            };
          } else if (property === 'color') {
            // Update node color in data
            return {
              ...node,
              data: {
                ...node.data,
                color: value
              }
            };
          } else if (property === 'shape') {
            // Update node type
            return {
              ...node,
              type: value
            };
          }
        }
        return node;
      });
    });

    // Update selected node reference
    setSelectedNode(prev => {
      if (!prev) return null;

      if (property === 'text') {
        return {
          ...prev,
          data: {
            ...prev.data,
            label: value
          }
        };
      } else if (property === 'color') {
        return {
          ...prev,
          data: {
            ...prev.data,
            color: value
          }
        };
      } else if (property === 'shape') {
        return {
          ...prev,
          type: value
        };
      }

      return prev;
    });
  };

  // Add a new node
  const addNode = () => {
    addNodeWithType('process', 'New Process');
  };

  // Add a node with specific type and assign appropriate colors
  const addNodeWithType = (nodeType: string, label: string) => {
    const newId = `node_${Date.now()}`;
    const position = getNewNodePosition();

    // Assign appropriate colors based on node type
    let nodeColor = '#FFFFFF';
    
    // Color coding scheme for flowchart symbols
    switch (nodeType) {
      case 'terminal':
        nodeColor = label.toLowerCase() === 'start' ? '#90EE90' : '#FFB6C1';
        break;
      case 'process':
        nodeColor = '#ADD8E6';
        break;
      case 'decision':
        nodeColor = '#FFFACD';
        break;
      case 'input':
        nodeColor = '#F0E68C';
        break;
      case 'output':
        nodeColor = '#D8BFD8';
        break;
      case 'document':
        nodeColor = '#FFE4B5';
        break;
      case 'connector':
        nodeColor = '#D3D3D3';
        break;
      case 'data_storage':
      case 'database':
        nodeColor = '#98FB98';
        break;
      case 'delay':
        nodeColor = '#FFC0CB';
        break;
      case 'preparation':
        nodeColor = '#E0FFFF';
        break;
      default:
        nodeColor = '#FFFFFF';
    }

    const newNode: Node = {
      id: newId,
      type: nodeType,
      data: { 
        label: label,
        color: nodeColor
      },
      position: position,
    };

    setNodes(nds => [...nds, newNode]);

    toast({
      title: 'Symbol Added',
      description: `Added a new "${label}" symbol to the flowchart`,
      duration: 1500,
    });
  };

  // Get position for a new node
  const getNewNodePosition = () => {
    if (selectedNode) {
      // Position below selected node if one is selected
      return { 
        x: selectedNode.position.x, 
        y: selectedNode.position.y + 120 
      };
    } else if (nodes.length > 0) {
      // Find the lowest node and position below it
      const lowestNode = nodes.reduce((lowest, node) => {
        return node.position.y > lowest.position.y ? node : lowest;
      }, nodes[0]);

      return { 
        x: lowestNode.position.x, 
        y: lowestNode.position.y + 120 
      };
    } 

    // Default position if no nodes exist
    return { x: 250, y: 100 };
  };

  // Delete a node
  const deleteNode = () => {
    if (!selectedNode) return;

    // Remove the node
    setNodes(nds => nds.filter(node => node.id !== selectedNode.id));

    // Remove any connected edges
    setEdges(eds => eds.filter(
      edge => edge.source !== selectedNode.id && edge.target !== selectedNode.id
    ));

    toast({
      title: 'Symbol Deleted',
      description: `Removed the "${selectedNode.data.label}" symbol`,
      duration: 1500,
    });

    setSelectedNode(null);
  };

  // Save the flowchart
  const saveData = () => {
    if (onSave) {
      onSave(nodes, edges);

      toast({
        title: 'Flowchart Saved',
        description: `Your flowchart has been saved successfully`,
        duration: 2000,
      });
    }
  };

  // Auto layout function
  const autoLayout = () => {
    try {
      // Import and use applyAutoLayout
      import('@/lib/flowchartUtils').then(({ applyAutoLayout }) => {
        // Convert ReactFlow nodes to FlowchartNodes
        const flowchartNodes = nodes.map(node => ({
          ...node,
          type: node.type || 'default',
        }));
        
        const { nodes: layoutedNodes, edges: layoutedEdges } = applyAutoLayout(flowchartNodes, edges);
        
        // Update the nodes with new positions
        setNodes(layoutedNodes);
        setEdges(layoutedEdges);
        
        // Center the view on the new layout
        setTimeout(() => {
          reactFlowInstance.fitView({ padding: 0.2 });
        }, 50);

        toast({
          title: 'Layout Applied',
          description: 'Flowchart has been automatically arranged',
        });
      });
    } catch (error) {
      console.error('Error applying auto layout:', error);
      toast({
        title: 'Error',
        description: 'Failed to apply automatic layout',
        variant: 'destructive',
      });
    }
  };

  // Handle download action - Updated to capture entire flow
  const handleDownload = useCallback(async () => {
    const flowViewport = document.querySelector('.react-flow__viewport');
    if (!flowViewport) {
      toast({
        title: 'Error',
        description: 'Could not find the flowchart viewport element.',
        variant: 'destructive',
      });
      return;
    }

    const nodesBounds = getNodesBounds(reactFlowInstance.getNodes());
    const viewport = getViewportForBounds(
      nodesBounds,
      imageWidth,
      imageHeight,
      0.5, // minZoom (adjust as needed)
      2,   // maxZoom (adjust as needed)
      0.1  // padding
    );

    try {
      const dataUrl = await toPng(flowViewport as HTMLElement, {
        backgroundColor: '#ffffff',
        width: imageWidth,
        height: imageHeight,
        style: {
          width: `${imageWidth}px`,
          height: `${imageHeight}px`,
          transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
        },
      });
      const link = document.createElement('a');
      link.download = 'flowchart.png';
      link.href = dataUrl;
      link.click();
      toast({
        title: 'Downloaded',
        description: 'Flowchart downloaded as PNG.',
      });
    } catch (error) {
      console.error('Error downloading flowchart:', error);
      toast({
        title: 'Download Failed',
        description: 'Could not generate PNG image.',
        variant: 'destructive',
      });
    }
  }, [toast, reactFlowInstance]);

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-2 p-2 border-b">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={addNode}
          >
            <span className="material-icons text-sm mr-1">add</span>
            Add Node
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={autoLayout}
          >
            <span className="material-icons text-sm mr-1">auto_fix_high</span>
            Auto Layout
          </Button>
        </div>
        <Button 
          onClick={saveData} 
          size="sm" 
          className="ml-auto"
        >
          <span className="material-icons text-sm mr-1">save</span>
          Save
        </Button>
      </div>
      
      {/* Canvas Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Symbol Palette */}
        <FlowchartSymbolPalette onAddNode={addNodeWithType} />


        {/* Flowchart Canvas */}
        <div className="flex-1 relative" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={memoizedNodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            defaultEdgeOptions={{
              type: 'default',
              style: { stroke: '#555', strokeWidth: 2 },
              markerEnd: { type: MarkerType.ArrowClosed }
            }}
            connectionLineStyle={{ stroke: '#555', strokeWidth: 2 }}
            fitView
            snapToGrid
            attributionPosition="bottom-right"
            className="bg-white"
          >
            <Controls 
              position="bottom-right"
              showInteractive={false}
              className="!bg-white !border !border-neutral-200 !rounded-md !shadow-sm"
            />
            <MiniMap 
              nodeStrokeColor={(n) => {
                return n.selected ? '#1a192b' : '#555';
              }}
              nodeColor={(n) => {
                return n.data.color || '#fff';
              }}
              className="bg-white border !border-neutral-200 !rounded-md !shadow-sm"
              style={{ height: 100 }}
            />
            <Background color="#aaa" gap={16} className="bg-white" />
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

        {/* Properties Panel */}
        {selectedNode && (
          <NodeProperties 
            node={{
              id: selectedNode.id,
              text: selectedNode.data.label,
              children: [],
              shape: selectedNode.type,
            }} 
            onUpdateProperty={updateNodeProperty}
            onDelete={deleteNode}
          />
        )}
      </div>
    </div>
  );
}