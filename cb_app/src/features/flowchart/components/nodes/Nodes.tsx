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
    handleAddNode('First Response', 'neutral', id);
  };
  return (
    <Box onClick={addNodeHandler} sx={{ cursor: 'pointer' }}>
      <Chip label={data.label} color="primary" />
      <Handle type="source" position={Position.Right} isConnectable={true} />
    </Box>
  );
};

export const ResponseNode: React.FC<NodeProps<INodeData>> = ({ data, id }) => {
  const { nodeDrawerOpen, setNodeDrawer, setCurrentNode, onNodeClick, clickedNode, setNodeDrawerOpen } = useFlowStore(
    (state) => ({
      nodeDrawerOpen: state.nodeDrawerOpen,
      setNodeDrawer: state.setNodeDrawer,
      setCurrentNode: state.setCurrentNode,
      onNodeClick: state.onNodeClick,
      clickedNode: state.clickedNode,
      setNodeDrawerOpen: state.setNodeDrawerOpen,
      // openNodeSelector: state.openNodeSelector,
      // setOpenNodeSelector: state.setOpenNodeSelector,
    }),
  );
  // const [nodeData, setNodeData] = useState(data || {});
  const [openNodeSelector, setOpenNodeSelector] = useState(false);
  const [addBtnOpacity, setAddBtnOpacity] = useState(0);
  const [openController, setOpenController] = useState(false);

  const addNodeHandler = (event) => {
    event?.stopPropagation();
    setCurrentNode(id);
    setOpenNodeSelector(true);
    event.preventDefault();
  };

  const nodeClickHandler = (e) => {
    setOpenController(true);
    // e.stopPropagation();
  };

  const styleHandler = (theme, component) => {
    const style = {
      wrapper: {
        bgcolor: theme.palette.bgNode[data?.responseType],
        border: `1px solid ${theme.palette.divider}`,
        position: 'relative',
        px: 1,
        py: 2,
        borderRadius: 2,
        maxHeight: '250px',
      },
      collapsableNodeSelector: {
        position: 'absolute',
        top: 0,
        right: 0,
        transform: 'translateX(100%)',
      },
      collapsePanel: {
        position: 'absolute',
        right: '0',
        height: '100%',
      },
      addNodeBtn: {
        opacity: addBtnOpacity,
        transition: 'opacity 0.2s ease-in',
        position: 'absolute',
        top: '-20px',
        right: '-10px',
      },
    };
    return style[component];
  };

  return (
    <>
      <Box
        className="nowheel"
        sx={(theme) => styleHandler(theme, 'wrapper')}
        onMouseEnter={() => setAddBtnOpacity(1)}
        onMouseLeave={() => setAddBtnOpacity(0)}
        onClick={(e) => nodeClickHandler(e)}
      >
        <ClickAwayListener onClickAway={() => setOpenNodeSelector(false)}>
          <Collapse in={openNodeSelector} sx={(theme) => styleHandler(theme, 'collapsableNodeSelector')}>
            <NodeTypeSelector parentId={id} handleClose={setOpenNodeSelector} />
          </Collapse>
        </ClickAwayListener>
        <Handle type="source" position={Position.Right} isConnectable={true} />
        <IconButton
          color="primary"
          aria-label="Add Node"
          onClick={addNodeHandler}
          sx={(theme) => styleHandler(theme, 'addNodeBtn')}
        >
          <AddCircleRoundedIcon />
        </IconButton>
        <Box
          sx={(theme) => ({
            overflowX: 'hidden',
            overflowY: 'auto',
          })}
        >
          <Typography variant="h6">
            {id} - {data?.responseLabel || data?.responseType}
          </Typography>

          <Typography sx={(theme) => ({ maxHeight: '200px', overflowY: 'auto' })}>
            {data?.responseBot || 'Tell what the bot should respond'}
          </Typography>
        </Box>
        <Handle type="target" position={Position.Left} isConnectable={true} />
        <NodeControlDrawer id={id} data={data} openController={openController} setOpenController={setOpenController} />
      </Box>
    </>
  );
};

export const CustomNode: React.FC<NodeProps<INodeData>> = ({ data, id }) => {
  const connection = useConnection();
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
