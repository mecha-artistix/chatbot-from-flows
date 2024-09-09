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
  //   setOpenNodeSelector: (open) => set({ openNodeSelector: open }),
  setCurrentNode: (nodeId) => set({ currentNode: nodeId }),
  setNextNodeType: (nodeType) => set({ nextNodeType: nodeType }),

  onNodeClick: (event, node) => {
    console.log('node clicked', node.id);
    console.log(node);
    set({ clickedNode: node, nodeDrawerOpen: node.id !== 'start_node' });
  },

  addNode: (newNode) => {
    console.log('add Node called');
    const { nodes } = get();

    set({ nodes: [...nodes, newNode] });
  },

  addEdge: (edge) => set((state) => ({ edges: [...state.edges, edge] })),

  setNodeDrawer: (open) => set({ nodeDrawerOpen: open }),

  setDataLabel: (text) => {
    set({ dataLabel: text });
  },

  setNode: (id, resData) => {
    const { nodes } = get();
    const updatedNodes = nodes.map((node) =>
      node.id === id
        ? {
            ...node,
            data: {
              ...node.data,
              label: resData.label,
              description: resData.description,
            },
          }
        : node,
    );
    set({ nodes: updatedNodes });
  },
});
