import { useState, useCallback, useEffect } from 'react';
import {
  Drawer,
  Paper,
  Stack,
  Typography,
  TextField,
  Button,
  IconButton,
  Box,
  TextareaAutosize,
  ClickAwayListener,
  Collapse,
} from '@mui/material';
import useFlowStore from '../store/FlowStore';
import { useThemeStore } from '../../../theme/themeStore';
import CloseIcon from '@mui/icons-material/Close';
import { Textarea } from '@mui/joy';
import { getIncomers } from '@xyflow/react';
// export const NodeControlDrawer: React.FC<INodeControlDrawerProps> = ({ open }) => {
export const NodeControlDrawer: React.FC<INodeControlDrawerProps> = ({
  id,
  data,
  openController,
  setOpenController,
}) => {
  const { nodes, nodeDrawerOpen, edges, setNodeDrawerOpen, clickedNode, setNode, setLayout } = useFlowStore(
    (state) => ({
      nodeDrawerOpen: state.nodeDrawerOpen,
      setNodeDrawerOpen: state.setNodeDrawerOpen,
      nodes: state.nodes,
      setNode: state.setNode,
      clickedNode: state.clickedNode,
      setLayout: state.setLayout,
      edges: state.edges,
    }),
  );
  const TopBarHeight = useThemeStore((state) => state.topBarHeight);
  // const [resData, setResData] = useState({ label: '', description: '', personResponse: '', botResponse: '' });
  const [resData, setResData] = useState({ ...data });
  const [parent, setParent] = useState();

  const handleChange = (e: React.ChangeEvent) => {
    setResData({ ...resData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    setNode(id, resData);
    setNodeDrawerOpen(false);
    setOpenController(false);
    setLayout();
  };
  useEffect(() => {
    setParent((prev) => {
      const parent = getIncomers({ id: id }, nodes, edges)[0];
      return parent;
    });
  }, [openController]);

  return (
    <Drawer
      key={id}
      hideBackdrop={true}
      open={openController}
      anchor="right"
      PaperProps={{ sx: { width: '320px', height: `calc(100% - ${TopBarHeight}px)`, top: TopBarHeight } }}
      onClick={(e) => e.stopPropagation()}
    >
      <Stack direction="column">
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <TextField
            id="filled-basic"
            variant="standard"
            name="responseLabel"
            value={resData?.responseLabel || `Bot Response ${clickedNode?.id}`}
            onChange={handleChange}
            fullWidth
            inputProps={{ style: { fontSize: 28 } }}
            sx={{}}
          />

          <IconButton onClick={() => setOpenController(false)}>
            <CloseIcon color="warning" />
          </IconButton>
        </Stack>
        <Paper sx={{ height: '100%', width: '100%', py: 4, px: 2 }}>
          <Stack sx={{ height: '100%' }} spacing={4}>
            <Box>
              <Typography>
                If user responds {resData.responseType || ''}ly to {parent?.data?.responseLabel} <br /> Examples of how
                the {resData.responseType} response from user will look like
              </Typography>
              <TextField
                placeholder="Example of Person Responses to bot."
                multiline
                fullWidth
                minRows={5}
                maxRows={8}
                name="responsePerson"
                onChange={handleChange}
                value={resData.responsePerson}
              />
            </Box>
            <Box>
              <Typography>Prompt for next bot response</Typography>
              <TextField
                placeholder="Write what the bot should respond with"
                multiline
                fullWidth
                minRows={5}
                maxRows={8}
                name="responseBot"
                onChange={handleChange}
                value={resData.responseBot}
              />
            </Box>
            <Button onClick={handleSubmit} variant="contained">
              Submit
            </Button>
          </Stack>
        </Paper>
      </Stack>
    </Drawer>
  );
};

interface INodeControlDrawerProps {
  parentNode?: string;
}
