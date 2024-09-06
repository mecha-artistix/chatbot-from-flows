import { useCallback } from 'react';
import useFlowStore from '../store/FlowStore';
import { useDAGRELayout } from '../utils/useDAGRELayout';

const useAddNode = () => {
  const getLayoutedElements = useDAGRELayout({ direction: 'LR' });

  const { nodes, edges, currentNode, addNode, addEdge, setNodes, setEdges, setNodeDrawer } = useFlowStore((state) => ({
    nodes: state.nodes,
    edges: state.edges,
    currentNode: state.currentNode,
    addNode: state.addNode,
    addEdge: state.addEdge,
    setNodes: state.setNodes,
    setEdges: state.setEdges,
    setNodeDrawer: state.setNodeDrawer,
  }));

  const handleAddNode = useCallback(
    (label, nextResponseType, source) => {
      console.log('log from handleAddNode');
      const id = `${nodes.length + 1}`;

      const nextNode = {
        id: id,
        type: 'response_node',
        data: { label, responseType: nextResponseType },
        position: { x: 400, y: 300 },
        draggable: false,
        connectable: true,
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

      const edge = {
        id: `edge-${currentNode}-${nextNode.id}`,
        // source: currentNode,
        source: source,
        target: nextNode.id,
        style: { stroke: edgeStroke(nextResponseType), strokeWidth: 2 },
      };
      addEdge(edge);

      // const { nodes: updatedNodes, edges: updatedEdges } = useFlowStore.getState();
      // const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements([...nodes,nextNode], [updatedEdges]);
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        [...nodes, nextNode],
        [...edges, edge],
      );
      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
      setNodeDrawer(false);
    },
    [nodes, currentNode, addNode, addEdge, setNodes, setEdges, setNodeDrawer],
  );
  return handleAddNode;
};

export default useAddNode;
