// import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import {
  Box,
  ClickAwayListener,
  Collapse,
  TextField,
  Button,
  FormControl,
  FormLabel,
  InputAdornment,
  Paper,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useFlowStore from '../store/FlowStore';

function CreateNewBtn() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [flowName, setFlowName] = useState<string>('');
  const { id, name, status, setName, error } = useFlowStore((state) => ({
    id: state.id,
    name: state.name,
    status: state.status,
    setName: state.setName,
    error: state.error,
  }));

  const handleClick = (e) => {
    setOpen((prev) => !prev);
    e.stopPropagation();
  };

  const style = {
    collapsable: {
      width: '500px',
      position: 'absolute',
      top: '100%',
    },
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFlowName(e.target.value);
  };

  const handleSubmit = async (e) => {
    await setName(flowName).then(() => {
      const updatedId = useFlowStore.getState().id;
      navigate(`/create-flowchart?flow=${updatedId}`);
    });
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <Button onClick={handleClick} variant="contained" endIcon={<AddIcon />}>
        Create New Flow
      </Button>
      <ClickAwayListener onClickAway={() => setOpen(false)}>
        <Collapse in={open} sx={style.collapsable}>
          <Paper sx={{ p: 2 }}>
            <FormControl fullWidth>
              <FormLabel>Enter name for the flowchart</FormLabel>
              <TextField
                margin="none"
                variant="filled"
                placeholder="Flowchart"
                type="text"
                required
                value={flowName}
                onChange={handleChange}
                error={status === 'failed'}
                helperText={status === 'failed' ? error : ''}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end" sx={{ p: 0, m: 0 }}>
                      <Button
                        onClick={handleSubmit}
                        variant="contained"
                        color="primary"
                        type="submit"
                        sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                        disabled={status === 'loading'} // Disable button during loading
                      >
                        {status === 'loading' ? 'Loading...' : 'Create'}
                      </Button>
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>
          </Paper>
        </Collapse>
      </ClickAwayListener>
    </Box>
  );
}

export default CreateNewBtn;
