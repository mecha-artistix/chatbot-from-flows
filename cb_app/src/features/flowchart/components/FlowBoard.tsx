import React, { useEffect, useState, useRef } from 'react';
import { ReactFlow, Controls, Background, Panel, useReactFlow } from '@xyflow/react';
import useThemeStore from '../../../theme/themeStore';
import { Box, Button, CircularProgress, Stack } from '@mui/material';
import '@xyflow/react/dist/style.css';
import useFlowStore from '../store/FlowStore';
import { useLoaderData, useLocation } from 'react-router-dom';
import { patchFlowchart } from '../services/fetchFlowchart';
import useGeneratePrompt from '../../bots/utils/generatePromptString';
import { createBot } from '../../chatBox/services';
import { useChatBoxStore } from '../../chatBox/chatBoxStore';

// import ChatBox from '../../chatBox/ChatBox';

const FlowBoard: React.FC = () => {
  // const [openChatBox, setOpenChatBox] = useState(false);
  const { getViewport } = useReactFlow();
  const flowchart = useLoaderData();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const mode = useThemeStore((state) => state.mode);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const flowId: string = queryParams.get('flow') as string;
  const [saveStatus, setSaveStatus] = useState('');
  const { setOpenChatBox } = useChatBoxStore((state) => ({
    setOpenChatBox: state.setOpenChatBox,
  }));
  const {
    name,
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    defaultEdgeOptions,
    onConnect,
    nodeTypes,
    onNodeClick,
    setFlowboard,
    viewport,
  } = useFlowStore((state) => ({
    name: state.name,
    nodes: state.nodes,
    edges: state.edges,
    defaultEdgeOptions: state.defaultEdgeOptions,
    onNodesChange: state.onNodesChange,
    onEdgesChange: state.onEdgesChange,
    onConnect: state.onConnect,
    nodeTypes: state.nodeTypes,
    onNodeClick: state.onNodeClick,
    setFlowboard: state.setFlowboard,
    viewport: state.viewport,
  }));

  const { generatePrompt } = useGeneratePrompt();

  useEffect(() => {
    setFlowboard(flowchart);
  }, []);

  // useEffect(() => {
  //   // console.log('nodes--', nodes, 'edges---', edges);
  // }, [nodes.length, edges.length]);

  const handleTestBot = async () => {
    const prompt = generatePrompt(nodes, edges);
    const body = {
      name: name,
      promptText: prompt,
      source: flowId,
    };
    const response = await createBot(body);

    if (response.status === 'fail') {
      return;
    }
    const bot = await response.data.data._id;
    setOpenChatBox(bot);
    console.log(bot);
    // navigate(`/chat-box/${bot}`, { replace: false });
    // console.log('prompt after', prompt);
  };

  const handleSave = async () => {
    setSaveStatus('loading');
    console.log(viewport);
    const body = JSON.stringify({
      nodes: nodes,
      edges: edges,
      viewport: getViewport(),
    });
    const update = await patchFlowchart(flowId, body);
    if (update.status === 'fail') {
      setSaveStatus('fail');
      return null;
    }
    setSaveStatus('saved');
  };

  return (
    <Box sx={{ height: '100%', width: '100%' }} ref={reactFlowWrapper}>
      <ReactFlow
        colorMode={mode}
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        defaultViewport={viewport}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        onNodeClick={onNodeClick}
        fitView
      >
        <Background />
        <Panel style={{}} position="bottom-left">
          <Stack direction="row" spacing={1} justifyContent="flex-end" px={2}>
            <Button variant="contained" onClick={handleTestBot}>
              Test Bot
            </Button>
            <Button
              variant="outlined"
              onClick={handleSave}
              disabled={saveStatus === 'loading'}
              startIcon={saveStatus === 'loading' ? <CircularProgress size={20} /> : null}
            >
              {saveStatus === 'loading' ? 'loading' : 'save'}
            </Button>
          </Stack>
        </Panel>
        <Controls position="bottom-right" />
      </ReactFlow>
      {/* <ChatBox openChatBox={openChatBox} setOpenChatBox={setOpenChatBox} /> */}
    </Box>
  );
};

export default FlowBoard;
