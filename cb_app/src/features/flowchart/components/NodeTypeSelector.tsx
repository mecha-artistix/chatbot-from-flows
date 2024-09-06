import React from 'react';
import { List, ListItemButton, ListItemIcon, ListItemText, Paper } from '@mui/material';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import useFlowStore from '../store/FlowStore';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import useAddNode from '../hooks/useAddNode';
// import { nodeTypes } from './nodes/nodeTypes';
const responseTypes = [
  { name: 'positive', icon: <EmojiEmotionsIcon /> },
  { name: 'neutral', icon: <EmojiEmotionsIcon /> },
  { name: 'negative', icon: <EmojiEmotionsIcon /> },
];

function NodeTypeSelector({ parentId, handleClose }) {
  const handleAddNode = useAddNode();
  const { setCurrentNode, nodeTypes, setNodeDrawer, setNextNodeType, setNextResponseType } = useFlowStore((state) => ({
    setCurrentNode: state.setCurrentNode,
    nodeTypes: state.nodeTypes,
    setNextNodeType: state.setNextNodeType,
    setNodeDrawer: state.setNodeDrawer,
    setNextResponseType: state.setNextResponseType,
  }));

  const clickHandler = (event, el) => {
    event?.stopPropagation();
    console.log(event, el);

    handleAddNode('', el, parentId);
    handleClose(false);
    // event.preventDefault();
  };
  return (
    <Paper elevation={10}>
      <List>
        {responseTypes.map((el, i) => (
          <ListItemButton key={i} onClick={(event) => clickHandler(event, el.name)}>
            <ListItemIcon>{el.icon}</ListItemIcon>
            <ListItemText primary={el.name} />
          </ListItemButton>
        ))}

        {/* {nodeTypes &&
          Object.keys(nodeTypes).map((el, i) => (
            <ListItemButton key={i} onClick={() => clickHandler(el)}>
              <ListItemIcon>
                <AcUnitIcon />
              </ListItemIcon>
              <ListItemText primary={el} />
            </ListItemButton>
          ))} */}
      </List>
    </Paper>
  );
}

export default NodeTypeSelector;

// setNextResponseType(el);
// setNextNodeType(el);
// setNodeDrawer(true);
// setCurrentNode(parentId);
