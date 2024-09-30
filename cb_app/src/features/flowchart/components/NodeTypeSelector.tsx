import { List, ListItemButton, ListItemIcon, ListItemText, Paper } from '@mui/material';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import useAddNode from '../hooks/useAddNode';
import { ReactNode } from 'react';

const responseTypes: IResponseType[] = [
  { name: 'positive', icon: <EmojiEmotionsIcon /> },
  { name: 'neutral', icon: <EmojiEmotionsIcon /> },
  { name: 'negative', icon: <EmojiEmotionsIcon /> },
];

interface IResponseType {
  name: string;
  icon: ReactNode;
}

interface INodeTypeSelector {
  source: string;
  handleClose: (value: boolean) => void;
}

const NodeTypeSelector: React.FC<INodeTypeSelector> = ({ source, handleClose }) => {
  const handleAddNode = useAddNode();

  const clickHandler = (event: React.MouseEvent, el: string) => {
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
      </List>
    </Paper>
  );
};

export default NodeTypeSelector;
