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
import { useEffect, useReducer, useState } from "react";
import AddIcon from "@mui/icons-material/Add";

type State = {};
type Reducer = {};

const initState = { open: false };

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "collapse/open":
      return { ...state, open: action.payload };

    default:
      return state;
  }
};

interface ICreateNew {
  data?: Record<string, any>;
  fields: Record<string, any>[];
  onSubmit: (data: Record<string, any>) => Promise<Record<string, any>>;
  setRows: (result: any) => void;
  children: string;
}
const CreateNew: React.FC<ICreateNew> = ({ data, fields, onSubmit, setRows, children }) => {
  const [state, dispatch] = useReducer(reducer, initState);

  const [formData, setFormData] = useState<Record<string, string>>({});
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    dispatch({ type: "collapse/open", payload: true });
    e.stopPropagation();
  };

  const handleSubmit: React.FormEventHandler = async (e) => {
    e.preventDefault();
    try {
      const result = await onSubmit({ ...formData, ...data });
      console.log(result);
      setRows(result);
      dispatch({ type: "collapse/open", payload: false });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const initialData = fields.reduce(
      (acc, field) => {
        acc[field.name] = "";
        return acc;
      },
      {} as Record<string, string>,
    );

    setFormData(initialData);
  }, [fields]);
  const style = {
    collapsable: {
      width: "500px",
      position: "absolute",
      top: "100%",
      zIndex: 9,
    },
  };
  const inputProps: TextFieldProps = { margin: "none", variant: "outlined", required: true, onChange: handleChange };

  return (
    <Box sx={{ position: "relative" }}>
      <Button onClick={handleClick} variant="contained" endIcon={<AddIcon />}>
        {children}
      </Button>
      <ClickAwayListener onClickAway={() => dispatch({ type: "collapse/open", payload: false })}>
        <Collapse in={state.open} sx={style.collapsable}>
          <Paper sx={{ p: 2 }} elevation={10}>
            <form onSubmit={handleSubmit}>
              <Stack direction="column" gap={2} justifyContent="center">
                <FormLabel>Fill in below to {children}</FormLabel>
                {fields.map((field, i) => (
                  <FormControl key={i}>
                    <TextField
                      {...inputProps}
                      name={field.name}
                      type={field.type}
                      placeholder={field.name.toUpperCase()}
                      value={formData[field.name] || ""}
                      onChange={handleChange}
                    />
                  </FormControl>
                ))}

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

export default CreateNew;
