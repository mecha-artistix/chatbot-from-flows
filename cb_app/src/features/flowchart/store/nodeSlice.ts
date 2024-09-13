import { StateCreator, StoreApi } from 'zustand';
import { addEdge } from '@xyflow/react';
import { INodeSlice } from '../../../types/flowchart';
import { useAddNode } from '../utils/addNode';
import { StartNode, ResponseNode, CustomNode } from '../components/nodes/Nodes';

export const nodeSlice: StateCreator<INodeSlice> = (set, get, api) => ({
  //   id: 1,
  nodeDrawerOpen: false,
  dataLabel: '',
  currentNode: 0,
  nextNodeType: 'response_node',
  nextResponseType: 'neutral',
  clickedNode: null,
  setNextResponseType: (responseType) => set({ nextResponseType: responseType }),
  //   openNodeSelector: false,
  setNodeDrawerOpen: (open) => set({ nodeDrawerOpen: open }),
  setCurrentNode: (nodeId) => set({ currentNode: nodeId }),
  setNextNodeType: (nodeType) => set({ nextNodeType: nodeType }),

  onNodeClick: (event, node) => {
    set((state) => ({ ...state, clickedNode: node }));
  },

  addNode: (newNode) => {
    const { nodes } = get();

    set({ nodes: [...nodes, newNode] });
  },

  addEdge: (edge) => set((state) => ({ edges: [...state.edges, edge] })),

  setDataLabel: (text) => {
    set({ dataLabel: text });
  },

  setNode: (id, resData) => {
    console.log('setNode');
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
