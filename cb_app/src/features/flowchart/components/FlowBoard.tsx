import React, { useEffect, useCallback, useState, useRef } from 'react';
import { useThemeStore } from '../../../theme/themeStore';
import { Box, Button, Stack } from '@mui/material';
import '@xyflow/react/dist/style.css';
import useFlowStore from '../store/FlowStore';
import { useLocation } from 'react-router-dom';
import { useDAGRELayout } from '../utils/useDAGRELayout';
// import { nodeTypes } from './nodes/nodeTypes';
import { CustomNode, ResponseNode, StartNode } from './nodes/Nodes';
import {
  ReactFlow,
  Controls,
  Background,
  Panel,
  MiniMap,
  useReactFlow,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import { initialNodes } from './nodes/InitNode';
import { NodeControlDrawer } from './NodeControllerDrawer';
import { updateFlowchart } from '../services/fetchFlowchart';

const ReactFlowComp: React.FC = () => {
  // const FlowBoard: React.FC = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const connectingNodeId = useRef(null);
  // const { screenToFlowPosition } = useReactFlow();
  const mode = useThemeStore((state) => state.mode);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const flowId: string = queryParams.get('flow') as string;
  const getLayoutedElements = useDAGRELayout({ direction: 'LR' });
  // const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  // const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const {
    nodes,
    setFlowBoard,
    edges,
    onNodesChange,
    onEdgesChange,
    edgeTypes,
    defaultEdgeOptions,
    addNode,
    onConnect,
    setNodes,
    setEdges,
    currentNode,
    nodeTypes,
    clickedNode,
    onNodeClick,
  } = useFlowStore((state) => ({
    setFlowBoard: state.setFlowBoard,
    nodes: state.nodes,
    edges: state.edges,
    defaultEdgeOptions: state.defaultEdgeOptions,
    edgeTypes: state.edgeTypes,
    onNodesChange: state.onNodesChange,
    onEdgesChange: state.onEdgesChange,
    onConnect: state.onConnect,
    addNode: state.addNode,
    setNodes: state.setNodes,
    setEdges: state.setEdges,
    currentNode: state.currentNode,
    nodeTypes: state.nodeTypes,
    clickedNode: state.clickedNode,
    onNodeClick: state.onNodeClick,
  }));

  useEffect(() => {
    console.log('nodes=>', nodes, 'edges=>', edges);
  }, [nodes.length, edges.length]);

  const handleUpdateFlowchart = async () => {
    const body = JSON.stringify({
      nodes: nodes,
      edges: edges,
    });
    await updateFlowchart(flowId, body);
  };

  return (
    <Box sx={{ height: '100%', width: '100%' }} ref={reactFlowWrapper}>
      <ReactFlow
        colorMode={mode}
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        onNodeClick={onNodeClick}
        fitView
      >
        <Background />
        <Panel style={{}} position="bottom-left">
          <Stack direction="row" spacing={1} justifyContent="flex-end" px={2}>
            <Button variant="contained">Test Bot</Button>
            <Button variant="outlined" onClick={handleUpdateFlowchart}>
              Save
            </Button>
          </Stack>
        </Panel>
        <Controls position="bottom-right" />
        {/* <MiniMap nodeStrokeWidth={3} /> */}
        <NodeControlDrawer />
      </ReactFlow>
    </Box>
  );
};

// export default FlowBoard;

const FlowBoard = () => {
  return (
    <ReactFlowProvider>
      <ReactFlowComp />
    </ReactFlowProvider>
  );
};

export default FlowBoard;

// useEffect(() => {
//   console.log('nodes=>', nodes, 'edges=>', edges);
// const { nodes: updatedNodes, edges: updatedEdges } = useFlowStore.getState();
// const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(updatedNodes, updatedEdges);
// setNodes(layoutedNodes);
// setEdges(layoutedEdges);
// setNodeDrawer(false);
// }, []);

// useEffect(() => {
//   setFlowBoard(flowId);
//   useFlowStore.getState();
// }, [flowId]);

// let curId = useRef(10);
// const getId = () => `${curId.current++}`;

// const handleAddNode = () => {
//   const id = getId();

//   const newNode = {
//     id: id,
//     type: 'response_node',
//     data: { label: 'World' },
//     position: { x: 400, y: 300 },
//     draggable: true,
//     connectable: true,
//   };
//   addNode(newNode);
//   // const updatedNodes = useFlowStore.getState().nodes;
//   // const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(updatedNodes, edges);
//   // setNodes(layoutedNodes);
//   // setEdges(layoutedEdges);
// };

// let id = 10;
// const getId = () => `${id++}`;
// const onConnect = useCallback(() => {
//   console.log(connectingNodeId);
//   connectingNodeId.current = null;
// });
