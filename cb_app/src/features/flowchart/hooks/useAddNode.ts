import { useCallback } from 'react';
import useFlowStore from '../store/FlowStore';

const useAddNode = () => {
  const { nodes, addNode, addEdge, setLayout } = useFlowStore((state) => ({
    nodes: state.nodes,
    addNode: state.addNode,
    addEdge: state.addEdge,
    setLayout: state.setLayout,
  }));

  const handleAddNode = useCallback(
    (label, nextResponseType, source) => {
      const nextNode = {
        id: `${nodes.length + 1}`,
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
        id: `edge-${source}-${nextNode.id}`,
        source: source,
        target: nextNode.id,
        style: { stroke: edgeStroke(nextResponseType), strokeWidth: 2 },
      };
      addEdge(NextEdge);
      setLayout();
    },
    [nodes],
  );
  return handleAddNode;
};

export default useAddNode;
