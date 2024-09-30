import React, { useState } from 'react';
import { NodeProps } from '@xyflow/react';
import { Box, Chip, ClickAwayListener, Collapse, IconButton, Typography } from '@mui/material';
import { Handle, Position, useConnection } from '@xyflow/react';
import styles from '../Styles.module.css';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import { NodeControlDrawer } from '../NodeControllerDrawer';
import NodeTypeSelector from '../NodeTypeSelector';
import useAddNode from '../../hooks/useAddNode';
import { INode } from '../../../../types/flowchart';

/* START NODE
. 
*/

export const ResponseNode: React.FC<INode> = ({ data, id }) => {
  const [openNodeSelector, setOpenNodeSelector] = useState(false);
  const [addBtnOpacity, setAddBtnOpacity] = useState(0);
  const [openController, setOpenController] = useState(false);

  console.log(data);

  const addNodeHandler = (event: React.MouseEvent) => {
    setOpenNodeSelector(true);
    event.preventDefault();
    event?.stopPropagation();
  };

  const nodeClickHandler = () => {
    setOpenController(true);
  };

  return (
    <>
      <Box
        className="nowheel"
        sx={(theme) => ({
          bgcolor: theme.palette.bgNode[data?.responseType],
          border: `1px solid ${theme.palette.divider}`,
          position: 'relative',
          px: 1,
          py: 2,
          borderRadius: 2,
          maxHeight: '250px',
        })}
        onMouseEnter={() => setAddBtnOpacity(1)}
        onMouseLeave={() => setAddBtnOpacity(0)}
        onClick={() => nodeClickHandler()}
      >
        <ClickAwayListener onClickAway={() => setOpenNodeSelector(false)}>
          <Collapse
            in={openNodeSelector}
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              transform: 'translateX(100%)',
            }}
          >
            <NodeTypeSelector source={id} handleClose={setOpenNodeSelector} />
          </Collapse>
        </ClickAwayListener>
        <Handle type="source" position={Position.Right} isConnectable={true} />
        <IconButton
          color="primary"
          aria-label="Add Node"
          onClick={addNodeHandler}
          sx={{
            opacity: addBtnOpacity,
            transition: 'opacity 0.2s ease-in',
            position: 'absolute',
            top: '-20px',
            right: '-10px',
          }}
        >
          <AddCircleRoundedIcon />
        </IconButton>
        <Box
          sx={() => ({
            overflowX: 'hidden',
            overflowY: 'auto',
          })}
        >
          <Typography
            variant="h6"
            sx={(theme) => ({ fontWeight: 600, color: theme.palette.bgNode.contrastText[data?.responseType] })}
          >
            {id} - {data?.responseLabel || data?.responseType}
          </Typography>

          <Typography
            sx={(theme) => ({
              maxHeight: '200px',
              overflowY: 'auto',
              fontWeight: 400,
              color: theme.palette.bgNode.contrastText[data?.responseType],
            })}
          >
            {data?.responseBot || 'Tell what the bot should respond'}
          </Typography>
        </Box>
        <Handle type="target" position={Position.Left} isConnectable={true} />
        <NodeControlDrawer id={id} data={data} openController={openController} setOpenController={setOpenController} />
      </Box>
    </>
  );
};

export const CustomNode: React.FC<NodeProps> = ({ id }) => {
  const connection = useConnection();
  const isTarget = connection.inProgress && connection.fromNode.id !== id;

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

export const StartNode: React.FC<INode> = ({ data, id }) => {
  const handleAddNode = useAddNode();

  const addNodeHandler = () => {
    handleAddNode('First Response', 'neutral', id);
  };
  return (
    <Box onClick={addNodeHandler} sx={{ cursor: 'pointer' }}>
      <Chip label={data.responseLabel ? data.responseLabel : 'start'} color="primary" />
      <Handle type="source" position={Position.Right} isConnectable={true} />
    </Box>
  );
};
