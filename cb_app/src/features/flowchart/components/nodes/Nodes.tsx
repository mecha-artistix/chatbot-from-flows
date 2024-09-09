import React, { useEffect, useState } from 'react';
import { Node, NodeProps } from 'reactflow';
import { INodeData } from '../../../../types/flowchart';
import {
  Box,
  Button,
  Chip,
  ClickAwayListener,
  Collapse,
  Drawer,
  IconButton,
  Input,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Handle, Position, useConnection, useReactFlow } from '@xyflow/react';
import styles from '../Styles.module.css';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import useFlowStore from '../../store/FlowStore';
import { NodeControlDrawer } from '../NodeControllerDrawer';
import NodeTypeSelector from '../NodeTypeSelector';
import useAddNode from '../../hooks/useAddNode';

/* START NODE
. 
*/
export const StartNode: React.FC<NodeProps<INodeData>> = ({ data, id }) => {
  const handleAddNode = useAddNode();
  const { nodeDrawerOpen, setNodeDrawer, setCurrentNode, clickedNode } = useFlowStore((state) => ({
    nodeDrawerOpen: state.nodeDrawerOpen,
    setNodeDrawer: state.setNodeDrawer,
    setCurrentNode: state.setCurrentNode,
    clickedNode: state.clickedNode,
  }));

  const addNodeHandler = () => {
    // ask type of node
    // open drawer for the selected type of node
    // setCurrentNode(id);
    handleAddNode('First Response', 'neutral', id);
    // setNodeDrawer(true);
    // console.log(nodeDrawerOpen);
  };
  // onClick={addNodeHandler}
  return (
    <Box onClick={addNodeHandler} sx={{ cursor: 'pointer' }}>
      <Chip label={data.label} color="primary" />
      <Handle type="source" position={Position.Right} isConnectable={true} />
    </Box>
  );
};

export const ResponseNode: React.FC<NodeProps<INodeData>> = ({ data, id }) => {
  const { nodeDrawerOpen, setNodeDrawer, setCurrentNode, onNodeClick, clickedNode } = useFlowStore((state) => ({
    nodeDrawerOpen: state.nodeDrawerOpen,
    setNodeDrawer: state.setNodeDrawer,
    setCurrentNode: state.setCurrentNode,
    onNodeClick: state.onNodeClick,
    clickedNode: state.clickedNode,
    // openNodeSelector: state.openNodeSelector,
    // setOpenNodeSelector: state.setOpenNodeSelector,
  }));
  // const [nodeData, setNodeData] = useState(data || {});
  const [openNodeSelector, setOpenNodeSelector] = useState(false);
  const [addBtnOpacity, setAddBtnOpacity] = useState(0);
  // setCurrentNode(id);

  const addNodeHandler = (event) => {
    event?.stopPropagation();
    setCurrentNode(id);
    setOpenNodeSelector(true);
    event.preventDefault();
  };

  return (
    <Box
      sx={(theme) => ({
        bgcolor: theme.palette.bgNode[data?.responseType],
        border: `1px solid ${theme.palette.divider}`,
        position: 'relative',
        px: 1,
        py: 2,
        borderRadius: 2,
        color: theme.palette.grey[900],
      })}
      onMouseEnter={() => setAddBtnOpacity(1)}
      onMouseLeave={() => setAddBtnOpacity(0)}
    >
      <ClickAwayListener onClickAway={() => setOpenNodeSelector(false)}>
        <Collapse
          in={openNodeSelector}
          sx={(theme) => ({ position: 'absolute', top: 0, right: 0, transform: 'translateX(100%)', zIndex: 99999999 })}
        >
          <NodeTypeSelector parentId={id} handleClose={setOpenNodeSelector} />
        </Collapse>
      </ClickAwayListener>
      <Handle type="source" position={Position.Right} isConnectable={true} />
      <IconButton
        color="primary"
        aria-label="Add Node"
        onClick={addNodeHandler}
        sx={{ opacity: addBtnOpacity, transition: 'opacity 0.2s ease-in', position: 'absolute', top: -2, right: -1 }}
      >
        <AddCircleRoundedIcon />
      </IconButton>
      <Typography variant="h6">
        {data?.responseType} {id}
      </Typography>
      <Typography>{data ? data.label : 'no data'}</Typography>
      <Typography>{data ? data.description : 'no description'}</Typography>
      <Handle type="target" position={Position.Left} isConnectable={true} />
    </Box>
  );
};

export const CustomNode: React.FC<NodeProps<INodeData>> = ({ data, id }) => {
  const connection = useConnection();
  console.log(data, id);
  const isTarget = connection.inProgress && connection.fromNode.id !== id;
  const label = isTarget ? 'Drop here' : 'Drag to connect';

  return (
    <div className={styles.customNode}>
      <div className={styles.customNodeBody}>
        {!connection.inProgress && <Handle className={styles.customHandle} position={Position.Right} type="source" />}
        {(!connection.inProgress || isTarget) && (
          <Handle className={styles.customHandle} position={Position.Left} type="target" isConnectableStart={false} />
        )}
      </div>
    </div>
  );
};
