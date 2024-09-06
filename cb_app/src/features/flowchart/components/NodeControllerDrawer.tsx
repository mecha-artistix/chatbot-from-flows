import { useState, useCallback, useEffect } from 'react';
import {
  Drawer,
  Paper,
  Stack,
  Typography,
  TextField,
  Button,
  capitalize,
  IconButton,
  Box,
  TextareaAutosize,
} from '@mui/material';
import useFlowStore from '../store/FlowStore';
import { useDAGRELayout } from '../utils/useDAGRELayout';
import { useThemeStore } from '../../../theme/themeStore';
import CloseIcon from '@mui/icons-material/Close';
// export const NodeControlDrawer: React.FC<INodeControlDrawerProps> = ({ open }) => {
export const NodeControlDrawer: React.FC<INodeControlDrawerProps> = ({}) => {
  const getLayoutedElements = useDAGRELayout({ direction: 'LR' });

  const {
    nodes,
    edges,
    currentNode,
    nodeDrawerOpen,
    setNodeDrawer,
    addNode,
    addEdge,
    setNodes,
    setEdges,
    nextResponseType,
    clickedNode,
  } = useFlowStore((state) => ({
    nodeDrawerOpen: state.nodeDrawerOpen,
    setNodeDrawer: state.setNodeDrawer,
    nodes: state.nodes,
    edges: state.edges,
    addNode: state.addNode,
    addEdge: state.addEdge,
    setNodes: state.setNodes,
    setEdges: state.setEdges,
    currentNode: state.currentNode,
    nextResponseType: state.nextResponseType,
    clickedNode: state.clickedNode,
  }));
  const TopBarHeight = useThemeStore((state) => state.topBarHeight);
  const [label, setLabel] = useState<string>('');
  const handleLabelChange = (e) => {
    setLabel((prev) => e.target.value);
  };

  useEffect(() => {
    setLabel(clickedNode?.data?.label || '');
  }, []);

  const handleSubmit = () => {
    const data = {
      label: 'First Response',
      responseType: 'neutral',
    };
    clickedNode.data.label = label;
  };

  return (
    <Drawer
      hideBackdrop={true}
      open={nodeDrawerOpen}
      anchor="right"
      PaperProps={{ sx: { width: '320px', height: `calc(100% - ${TopBarHeight}px)`, top: TopBarHeight } }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h4" sx={{ textTransform: 'capitalize', textAlign: 'center' }}>
          {clickedNode?.data?.responseType || ''} Bot Response {clickedNode?.id}
        </Typography>
        <IconButton onClick={() => setNodeDrawer(false)}>
          <CloseIcon color="warning" />
        </IconButton>
      </Stack>
      <Paper sx={{ height: '100%', width: '100%', py: 4, px: 2 }}>
        <Stack sx={{ height: '100%' }} spacing={4}>
          <Typography sx={{ textTransform: 'capitalize', textAlign: 'center' }}>
            {clickedNode?.data?.responseType || ''} Bot Response {clickedNode?.id}
          </Typography>
          <TextField
            id="filled-basic"
            label="Label"
            variant="filled"
            value={label}
            onChange={handleLabelChange}
            fullWidth
            size="small"
          />
          <TextareaAutosize minRows="5" maxRows="8" style={{ width: '100%!important' }} />
          <Button onClick={handleSubmit} variant="contained">
            Submit
          </Button>
        </Stack>
      </Paper>
    </Drawer>
  );
};

interface INodeControlDrawerProps {
  parentNode?: string;
}

// nodes.find;

// console.log(clickedNode.data);
// updateNodeData(clickedNode.id, data);
// setNodes((nodes) =>
//     nodes.map((node) => (node.id === nodeId ? { ...node, data: { ...node.data, ...newData } } : node)),
//   );

//   const updateNodeData = (nodeId, newData) => {
//     setNodes((nodes) =>
//       nodes.map((node) => (node.id === nodeId ? { ...node, data: { ...node.data, ...newData } } : node)),
//     );
//   };

//   const handleAddNode = () => {
//     console.log('log from handleAddNode');
//     const id = `${nodes.length + 1}`;

//     const nextNode = {
//       id: id,
//       type: `response_node`,
//       data: { label: label, responseType: nextResponseType },
//       position: { x: 400, y: 300 },
//       draggable: false,
//       connectable: true,
//     };
//     addNode(nextNode);
//     // const { nextNodeId, nodes, edges } = useFlowStore.getState();
//     // console.log(nodes);
//     const edge = {
//       id: `edge-${currentNode}-${nextNode.id}`,
//       source: currentNode,
//       target: nextNode.id,
//     };
//     addEdge(edge);
//     const { nodes: updatedNodes, edges: updatedEdges } = useFlowStore.getState();
//     const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(updatedNodes, updatedEdges);
//     setNodes(layoutedNodes);
//     setEdges(layoutedEdges);
//     setNodeDrawer(false);
//   };
