import { useCallback } from 'react';
import useFlowStore from '../store/FlowStore';
import { getIncomers } from '@xyflow/react';

const useAddNode = () => {
  const { nodes, edges, setLayout, currentNode, addNode, addEdge, setNodes, setEdges, setNodeDrawer } = useFlowStore(
    (state) => ({
      nodes: state.nodes,
      edges: state.edges,
      currentNode: state.currentNode,
      addNode: state.addNode,
      addEdge: state.addEdge,
      setNodes: state.setNodes,
      setEdges: state.setEdges,
      setNodeDrawer: state.setNodeDrawer,
      setLayout: state.setLayout,
    }),
  );

  const handleAddNode = useCallback(
    (label, nextResponseType, source) => {
      const id = `${nodes.length + 1}`;
      const nextNode = {
        id: id,
        type: 'response_node',
        data: {
          responseLabel: label,
          responseType: nextResponseType,
          responsePerson: 'Person Response',
          responseBot: 'Bot Response',
        },
        width: 250,
        position: { x: 0, y: 0 },
        draggable: false,
        connectable: false,
        parent: source,
        // parent: { id: source },
        dragHandle: false,
      };
      addNode(nextNode);

      const edgeStroke = (responseType) => {
        switch (responseType) {
          case 'neutral':
            return 'blue';
          case 'positive':
            return 'green';
          case 'negative':
            return 'red';
          default:
            return 'blue';
        }
      };

      const NextEdge = {
        id: `edge-${currentNode}-${nextNode.id}`,
        // source: currentNode,
        source: source,
        target: nextNode.id,
        style: { stroke: edgeStroke(nextResponseType), strokeWidth: 2 },
      };
      addEdge(NextEdge);

      setLayout();
    },
    [nodes, currentNode, addNode, addEdge, setNodes, setEdges, setNodeDrawer],
  );
  return handleAddNode;
};

export default useAddNode;
