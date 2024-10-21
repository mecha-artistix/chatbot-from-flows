import {
  Box,
  Button,
  ClickAwayListener,
  Collapse,
  FormControl,
  FormLabel,
  Paper,
  Stack,
  TextField,
  TextFieldProps,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { createLead } from "../services";
import { Row } from "../Leads";

const style = {
  collapsable: {
    width: "500px",
    position: "absolute",
    top: "100%",
    zIndex: 9,
  },
};

interface ICreateNewLead {
  setRows: React.Dispatch<React.SetStateAction<Row[]>>;
}

const CreateNewLead: React.FC<ICreateNewLead> = ({ setRows }) => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({ name: "", phone: "", email: "" });
  const { id } = useParams();

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    setOpen((prev) => !prev);
    e.stopPropagation();
  };

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!data || !id) return;
    const { name, email, phone } = data;
    const body = { name, email, phone, leadsCollection: id };

    const newLead = await createLead(body);
    console.log(newLead);
    if (newLead && newLead.data) {
      setRows((prev) => {
        const { _id, name, email, phone, createdAt } = newLead.data.data;
        const row = { id: _id, name, email, phone, createdAt };
        return [row, ...prev];
      });
      setOpen(false);
      console.log("Form submitted with:", data);
    } else {
      console.log("failed");
    }
  };

  const inputProps: TextFieldProps = { margin: "none", variant: "outlined", required: true, onChange: handleChange };
  return (
    <Box sx={{ position: "relative" }}>
      <Button onClick={handleClick} variant="contained" endIcon={<AddIcon />}>
        Create New Lead
      </Button>
      <ClickAwayListener onClickAway={() => setOpen(false)}>
        <Collapse in={open} sx={style.collapsable}>
          <Paper sx={{ p: 2 }} elevation={10}>
            <form onSubmit={handleSubmit}>
              <Stack direction="column" gap={2} justifyContent="center">
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

                <Button type="submit" variant="contained">
                  Create
                </Button>
              </Stack>
            </form>
          </Paper>
        </Collapse>
      </ClickAwayListener>
    </Box>
  );
};

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
