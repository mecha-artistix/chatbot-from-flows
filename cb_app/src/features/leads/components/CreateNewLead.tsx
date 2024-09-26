import {
  Box,
  Button,
  ClickAwayListener,
  Collapse,
  FormControl,
  FormLabel,
  Paper,
  TextField,
  TextFieldVariants,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import { Form, useParams } from 'react-router-dom';
import { createLead } from '../services';

const style = {
  collapsable: {
    width: '500px',
    position: 'absolute',
    top: '100%',
    zIndex: 9,
  },
};

function CreateNewLead({ setLeads, setRows }) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({ name: '', phone: '', email: '' });
  const handleClick = (e) => {
    setOpen((prev) => !prev);
    e.stopPropagation();
  };
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  const { id } = useParams();
  async function handleSubmit(e) {
    e.preventDefault();
    if (!data) return;
    const { name, email, phone } = data;
    const body = { name, email, phone, dataSource: id };

    const newLead = await createLead(body);
    console.log(newLead);
    if (newLead && newLead.data) {
      // setLeads((prev) => {
      //   console.log(prev.length);
      //   return [...prev, newLead.data.data];
      // });
      setRows((prev) => {
        const { _id, name, email, phone, createdAt } = newLead.data.data;
        const row = { id: _id, name, email, phone, createdAt };
        return [...prev, row];
      });
      setOpen(false);
      console.log('Form submitted with:', data);
    } else {
      console.log('failed');
    }
  }

  const inputProps = { margin: 'none', variant: 'outlined', required: true, onChange: handleChange };
  return (
    <Box sx={{ position: 'relative' }}>
      <Button onClick={handleClick} variant="contained" endIcon={<AddIcon />}>
        Create New Lead
      </Button>
      <ClickAwayListener onClickAway={() => setOpen(false)}>
        <Collapse in={open} sx={style.collapsable}>
          <Paper sx={{ p: 2 }} elevation={10}>
            <form onSubmit={handleSubmit}>
              <FormLabel>Fill in below to create New Lead</FormLabel>
              <FormControl fullWidth>
                <TextField {...inputProps} name="name" placeholder="Name" type="text" value={data.name} />
              </FormControl>
              <FormControl fullWidth>
                <TextField {...inputProps} name="email" placeholder="Email" type="email" value={data.email} />
              </FormControl>
              <FormControl fullWidth>
                <TextField {...inputProps} name="phone" placeholder="phone" type="text" value={data.phone} />
              </FormControl>
              <Button type="submit">Create</Button>
            </form>
          </Paper>
        </Collapse>
      </ClickAwayListener>
    </Box>
  );
}

export default CreateNewLead;

/*

export async function action({ request, params }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const { name, email, phone } = data;
  const id = params.id;
  const body = { name, email, phone, dataSource: id };
  console.log('body', body);
  const newLead = await createLead(body);
  console.log('newLead', newLead);
  return newLead;
}


*/
