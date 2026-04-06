import { v4 as uuidv4 } from 'uuid';

export interface FlowchartNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    label: string;
    [key: string]: any;
  };
}

export interface FlowchartEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
  data?: {
    label?: string;
    [key: string]: any;
  };
}

export interface FlowchartData {
  nodes: FlowchartNode[];
  edges: FlowchartEdge[];
}

export const createNewNode = (
  type: string,
  position: { x: number; y: number },
  data: { label: string; [key: string]: any } = { label: 'New Node' }
): FlowchartNode => {
  return {
    id: uuidv4(),
    type,
    position,
    data,
  };
};

export const createNewEdge = (
  source: string,
  target: string,
  type?: string,
  data?: { label?: string; [key: string]: any }
): FlowchartEdge => {
  return {
    id: uuidv4(),
    source,
    target,
    type,
    data,
  };
};

export const validateFlowchartData = (data: FlowchartData): boolean => {
  if (!data.nodes || !data.edges) return false;
  
  const nodeIds = new Set(data.nodes.map(node => node.id));
  
  // Check if all edges reference valid nodes
  return data.edges.every(edge => 
    nodeIds.has(edge.source) && nodeIds.has(edge.target)
  );
};

export const getNodeConnections = (
  nodeId: string,
  edges: FlowchartEdge[]
): { incoming: FlowchartEdge[]; outgoing: FlowchartEdge[] } => {
  return {
    incoming: edges.filter(edge => edge.target === nodeId),
    outgoing: edges.filter(edge => edge.source === nodeId),
  };
};

export const findNodeById = (
  nodeId: string,
  nodes: FlowchartNode[]
): FlowchartNode | undefined => {
  return nodes.find(node => node.id === nodeId);
};

export const updateNodeData = (
  nodeId: string,
  data: Partial<FlowchartNode['data']>,
  nodes: FlowchartNode[]
): FlowchartNode[] => {
  return nodes.map(node =>
    node.id === nodeId
      ? { ...node, data: { ...node.data, ...data } }
      : node
  );
};

export const removeNodeAndConnections = (
  nodeId: string,
  flowchart: FlowchartData
): FlowchartData => {
  return {
    nodes: flowchart.nodes.filter(node => node.id !== nodeId),
    edges: flowchart.edges.filter(
      edge => edge.source !== nodeId && edge.target !== nodeId
    ),
  };
};

export const applyAutoLayout = (nodes: FlowchartNode[], edges: FlowchartEdge[]): { nodes: FlowchartNode[], edges: FlowchartEdge[] } => {
  // Create a map of nodes by their levels
  const nodeLevels = new Map<string, number>();
  const nodesByLevel = new Map<number, FlowchartNode[]>();
  
  // Find root nodes (nodes with no incoming edges)
  const hasIncomingEdge = new Set(edges.map(edge => edge.target));
  const rootNodes = nodes.filter(node => !hasIncomingEdge.has(node.id));
  
  // Assign levels to nodes using BFS
  const queue = rootNodes.map(node => ({ node, level: 0 }));
  while (queue.length > 0) {
    const { node, level } = queue.shift()!;
    
    // Skip if we've already processed this node at a lower level
    if (nodeLevels.has(node.id) && nodeLevels.get(node.id)! <= level) {
      continue;
    }
    
    // Assign level to node
    nodeLevels.set(node.id, level);
    if (!nodesByLevel.has(level)) {
      nodesByLevel.set(level, []);
    }
    nodesByLevel.get(level)!.push(node);
    
    // Add child nodes to queue
    const childEdges = edges.filter(edge => edge.source === node.id);
    for (const edge of childEdges) {
      const childNode = nodes.find(n => n.id === edge.target);
      if (childNode) {
        queue.push({ node: childNode, level: level + 1 });
      }
    }
  }
  
  // Position nodes by level
  const VERTICAL_SPACING = 100;
  const HORIZONTAL_SPACING = 200;
  const updatedNodes = nodes.map(node => {
    const level = nodeLevels.get(node.id) || 0;
    const nodesAtLevel = nodesByLevel.get(level) || [];
    const indexAtLevel = nodesAtLevel.findIndex(n => n.id === node.id);
    const totalNodesAtLevel = nodesAtLevel.length;
    
    // Calculate x position to center nodes at each level
    const levelWidth = (totalNodesAtLevel - 1) * HORIZONTAL_SPACING;
    const startX = -levelWidth / 2;
    const x = startX + (indexAtLevel * HORIZONTAL_SPACING);
    
    return {
      ...node,
      position: {
        x,
        y: level * VERTICAL_SPACING
      }
    };
  });
  
  return {
    nodes: updatedNodes,
    edges
  };
}; 