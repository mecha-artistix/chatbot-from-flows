import { StateCreator, StoreApi } from 'zustand';
import { addEdge, applyEdgeChanges, applyNodeChanges } from '@xyflow/react';
import { initialEdges, initialNodes, initNodes, startNode } from '../components/nodes/InitNode';
import { IFlowBoardSlice, INode, INodeData } from '../../../types/flowchart';
import { createFlowchart, getFlowchart } from '../services/fetchFlowchart';
import { edge1 } from '../components/edges/InitEdges';
import { StartNode, ResponseNode, CustomNode } from '../components/nodes/Nodes';
import { useDAGRELayout } from '../utils/useDAGRELayout';

const getLayoutedElements = useDAGRELayout({ direction: 'LR' });

const URL: string = import.meta.env.VITE_NODE_BASE_API + '/flowcharts';
const nodeTypes = {
  start_node: StartNode,
  response_node: ResponseNode,
  custom_node: CustomNode,
};
const edgeTypes = {};

export const flowBoardSlice: StateCreator<IFlowBoardSlice> = (set, get, api) => ({
  id: '',
  name: '',
  status: '',
  error: '',
  nodes: [startNode],
  edges: initialEdges,
  nodeTypes,
  edgeTypes: edgeTypes,
  defaultEdgeOptions: { animated: true },

  setName: async (name) => {
    set({ status: 'loading', error: '' });
    // const { nodes } = get();
    const data = await createFlowchart(name, startNode);
    if (data.status === 'failed') {
      set({ status: 'failed', error: data.error });
    }
    if (data) {
      set({
        id: data.data._id,
        name: data.data.name,
        status: data.status,
      });
    }
  },

  onNodesChange: (changes) => {
    const { nodes } = get();
    const updatedNodes = applyNodeChanges(changes, nodes);
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
    // refer to docs core-concept to see how edge options can be added
    set({ edges: updatedEdges });
  },

  setNodes: (nodes) => {
    set({ nodes });
  },

  setEdges: (edges) => {
    console.log(edges);
    set({ edges });
  },

  setFlowBoard: async (id) => {
    try {
      set({ status: 'loading', error: '' });
      const data = await getFlowchart(id);
      const { nodes, edges } = data.data;
      set({ nodes, edges, status: 'success' });
    } catch (error) {
      set({ status: 'error', error: error.message });
    }
  },

  setLayout: () => {
    const { nodes, edges } = get();
    // console.log(nodes, edges);
    console.log('nodes, edges');
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements([...nodes], [...edges]);
    set({ nodes: layoutedNodes, edges: layoutedEdges });
  },
});
