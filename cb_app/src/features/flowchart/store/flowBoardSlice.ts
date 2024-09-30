import { StateCreator } from 'zustand';
import { addEdge, applyEdgeChanges, applyNodeChanges } from '@xyflow/react';
import { startNode } from '../components/nodes/InitNode';
import { IFlowBoardSlice, INode } from '../../../types/flowchart';
import { StartNode, ResponseNode, CustomNode } from '../components/nodes/Nodes';
import { useDAGRELayout } from '../utils/useDAGRELayout';

const getLayoutedElements = useDAGRELayout({ direction: 'LR' });

const nodeTypes = {
  start_node: StartNode,
  response_node: ResponseNode,
  custom_node: CustomNode,
};
const edgeTypes = {};

export const flowBoardSlice: StateCreator<IFlowBoardSlice> = (set, get) => ({
  id: '',
  name: '',
  nodes: [startNode],
  edges: [],
  clickedNode: null,
  viewport: { x: 0, y: 0, zoom: 1 },
  nodeTypes,
  edgeTypes,
  defaultEdgeOptions: { animated: true },

  setFlowboard: (flowchart) => {
    const { _id, name, nodes, edges, viewport } = flowchart;
    set({ id: _id, name, nodes, edges, viewport });
  },

  onNodesChange: (changes) => {
    const { nodes } = get();
    const updatedNodes = applyNodeChanges(changes, nodes) as INode[];
    set({ nodes: updatedNodes });
  },

  onEdgesChange: (changes) => {
    const { edges } = get();
    const updateEdges = applyEdgeChanges(changes, edges);
    set({ edges: updateEdges });
  },

  onConnect: (connection) => {
    const { edges } = get();
    const updatedEdges = addEdge(connection, edges);
    set({ edges: updatedEdges });
  },

  setNodes: (nodes) => {
    set({ nodes });
  },

  setEdges: (edges) => {
    edges;
    set({ edges });
  },

  setLayout: () => {
    const { nodes, edges } = get();
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements([...nodes], [...edges]);
    set({ nodes: layoutedNodes, edges: layoutedEdges });
  },

  onNodeClick: (_, node) => {
    set((state) => ({ ...state, clickedNode: node }));
  },

  addNode: (newNode) => {
    set((state) => ({ ...state, nodes: [...state.nodes, newNode] }));
  },

  addEdge: (edge) => set((state) => ({ edges: [...state.edges, edge] })),

  updateNodeData: (id, resData) => {
    const { nodes } = get();
    const updatedNodes = nodes.map((node) =>
      node.id === id
        ? {
            ...node,
            data: {
              ...node.data,
              ...resData,
            },
          }
        : node,
    );
    set({ nodes: updatedNodes });
  },
});
