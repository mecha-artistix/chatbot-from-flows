import React from 'react';
import { List, ListItemButton, ListItemIcon, ListItemText, Paper } from '@mui/material';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import useFlowStore from '../store/FlowStore';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import useAddNode from '../hooks/useAddNode';
const responseTypes = [
  { name: 'positive', icon: <EmojiEmotionsIcon /> },
  { name: 'neutral', icon: <EmojiEmotionsIcon /> },
  { name: 'negative', icon: <EmojiEmotionsIcon /> },
];

function NodeTypeSelector({ source, handleClose }) {
  const handleAddNode = useAddNode();
  // const { setCurrentNode, nodeTypes, setNodeDrawer, setNextNodeType, setNextResponseType } = useFlowStore((state) => ({
  //   setCurrentNode: state.setCurrentNode,
  //   nodeTypes: state.nodeTypes,
  //   setNextNodeType: state.setNextNodeType,
  //   setNodeDrawer: state.setNodeDrawer,
  //   setNextResponseType: state.setNextResponseType,
  // }));

  const clickHandler = (event, el) => {
    console.log('source hand- ', source);
    event?.stopPropagation();
    handleAddNode('', el, source);
    handleClose(false);
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
