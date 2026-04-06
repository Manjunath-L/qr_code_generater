import {
  applyNodeChanges,
  applyEdgeChanges,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
  type OnNodesChange,
  type OnEdgesChange,
  type XYPosition,
} from '@xyflow/react';
import { create } from 'zustand';
import { nanoid } from 'nanoid/non-secure';

export type NodeData = {
  label: string;
  isRoot?: boolean;
};

export type MindMapState = {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  addChildNode: (parentNode: Node, position: XYPosition) => void;
  updateNodeLabel: (nodeId: string, label: string) => void;
  deleteNode: (nodeId: string) => void;
  getNodeTree: () => { rootId: string; nodes: Record<string, any> };
};

// Default data for a new mind map
const DEFAULT_NODES: Node[] = [
  {
    id: '1',
    type: 'mindMapNode',
    data: { 
      label: 'Central Idea',
      isRoot: true
    },
    position: { x: 0, y: 0 },
    dragHandle: '.mindmap-node',
  }
];

const DEFAULT_EDGES: Edge[] = [];

const useMindMapStore = create<MindMapState>((set, get) => ({
  nodes: DEFAULT_NODES,
  edges: DEFAULT_EDGES,

  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  addChildNode: (parentNode: Node, position: XYPosition) => {
    const newNode = {
      id: nanoid(6),
      type: 'mindMapNode',
      data: { 
        label: 'New Topic',
        isRoot: false
      },
      position,
      dragHandle: '.mindmap-node',
    };

    const newEdge = {
      id: `e-${parentNode.id}-${newNode.id}`,
      source: parentNode.id,
      target: newNode.id,
      type: 'mindMapEdge',
    };

    set({
      nodes: [...get().nodes, newNode],
      edges: [...get().edges, newEdge],
    });
  },

  updateNodeLabel: (nodeId: string, label: string) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              label,
            },
          };
        }
        return node;
      }),
    });
  },

  deleteNode: (nodeId: string) => {
    // Don't delete the root node
    const isRoot = !get().edges.some(e => e.target === nodeId);
    if (isRoot) {
      return; // Don't delete root node
    }

    // Get all descendant nodes to delete
    const descendantIds = new Set<string>();
    
    const collectDescendants = (id: string) => {
      const children = get().edges
        .filter(e => e.source === id)
        .map(e => e.target);
      
      children.forEach(childId => {
        descendantIds.add(childId);
        collectDescendants(childId);
      });
    };
    
    collectDescendants(nodeId);
    descendantIds.add(nodeId);
    
    // Remove the nodes and their connected edges
    set({
      nodes: get().nodes.filter(node => !descendantIds.has(node.id)),
      edges: get().edges.filter(
        edge => !descendantIds.has(edge.source) && !descendantIds.has(edge.target)
      ),
    });
  },

  // Convert nodes and edges to a serializable format
  getNodeTree: () => {
    const { nodes, edges } = get();
    
    // Find the root node (node without incoming edges)
    const getIncoming = (nodeId: string) => edges.filter(e => e.target === nodeId);
    const getRootNode = () => {
      return nodes.find(node => getIncoming(node.id).length === 0) || nodes[0];
    };
    
    const rootNode = getRootNode();
    const rootId = rootNode?.id || '1';
    
    const treeNodes: Record<string, any> = {};
    
    // Create the nodes structure
    nodes.forEach(node => {
      treeNodes[node.id] = {
        id: node.id,
        text: node.data?.label || 'New Topic',
        children: []
      };
    });
    
    // Add children based on edges with safety checks
    edges.forEach(edge => {
      if (treeNodes[edge.source]) {
        // Ensure children property exists and is an array
        if (!treeNodes[edge.source].children || !Array.isArray(treeNodes[edge.source].children)) {
          treeNodes[edge.source].children = [];
        }
        treeNodes[edge.source].children.push(edge.target);
      }
    });
    
    return {
      rootId,
      nodes: treeNodes
    };
  },
}));

export default useMindMapStore;