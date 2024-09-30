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
import { useState } from 'react';
import { ActionFunction, Form, redirect, useActionData, useNavigation } from 'react-router-dom';
import { createFlowchart } from '../services/fetchFlowchart';
import { startNode } from './nodes/InitNode';

interface IActionData {
  response?: {
    data?: any;
  };
}

const CreateNewBtn = () => {
  const actionData = useActionData() as IActionData | undefined;
  const navigation = useNavigation();
  const [open, setOpen] = useState(false);
  const [flowName, setFlowName] = useState('');

  const isSubmitting = navigation.state === 'submitting';
  const error = actionData?.response?.data || {};

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
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

  return (
    <Box sx={{ position: 'relative' }}>
      <Button onClick={handleClick} variant="contained" endIcon={<AddIcon />}>
        Create New Flow
      </Button>
      <ClickAwayListener onClickAway={() => setOpen(false)}>
        <Collapse in={open} sx={style.collapsable}>
          <Paper sx={{ p: 2 }}>
            <Form method="POST">
              <FormControl fullWidth>
                <FormLabel>Enter name for the flowchart</FormLabel>
                <TextField
                  name="flowName"
                  margin="none"
                  variant="filled"
                  placeholder="Flowchart"
                  type="text"
                  required
                  value={flowName}
                  onChange={handleChange}
                  error={error.status === 'fail'}
                  helperText={status === 'failed' ? error : ''}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end" sx={{ p: 0, m: 0 }}>
                        <Button
                          variant="contained"
                          color="primary"
                          type="submit"
                          sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'Loading...' : 'Create'}
                        </Button>
                      </InputAdornment>
                    ),
                  }}
                />
              </FormControl>
            </Form>
          </Paper>
        </Collapse>
      </ClickAwayListener>
      {error && <p>{error.message}</p>}
    </Box>
  );
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const { flowName } = data;

  const newFlowchart = await createFlowchart(flowName, [startNode]);

  if (newFlowchart.error) return newFlowchart.error;

  // useFlowStore.getState().setFlowBoardIdName(newFlowchart.data._id, flowName);
  return redirect(`/create-flowchart?flow=${newFlowchart.data._id}`);
};

export default CreateNewBtn;
