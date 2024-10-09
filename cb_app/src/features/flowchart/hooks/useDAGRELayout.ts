// import * as dagreD3 from 'dagre-d3';
import dagre from 'dagre';
import { Node, Edge } from '@xyflow/react';

interface LayoutOptions {
  direction?: 'TB' | 'LR';
}

export const useDAGRELayout = (options: LayoutOptions = {}) => {
  const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
    // Initialize Dagre graph
    const g = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
    g.setGraph({ rankdir: options.direction || 'TB' });

    // Add edges and nodes
    edges.forEach((edge) => g.setEdge(edge.source, edge.target));
    nodes.forEach((node) => {
      // const { parentId, ...nodeWithoutParent } = node;
      g.setNode(node.id, {
        ...node,
        width: node.measured?.width ?? 0,
        height: node.measured?.height ?? 0,
      });
    });

    // Apply Dagre layout
    dagre.layout(g);

    // Adjust node positions

    return {
      nodes: nodes.map((node) => {
        const position = g.node(node.id);
        const x = position.x - (node.measured?.width ?? 0) / 2;
        const y = position.y - (node.measured?.height ?? 0) / 2;
        // const x = position.x - (node.width ?? 0);
        // const y = position.y - (node.height ?? 0);
        return { ...node, position: { x, y } };
      }),
      edges,
    };
  };

  return getLayoutedElements;
};
