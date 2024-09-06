import React from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

interface PasswordFieldProps {
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  label?: string;
  id?: string;
  name?: string;
  fullWidth?: boolean;
  size?: string;
}

const PasswordField: React.FC<PasswordFieldProps> = ({
  value,
  onChange,
  label = "Password",
  id,
  name = id,
  fullWidth = true,
  size = "small",
}) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <TextField
      variant="outlined"
      fullWidth={fullWidth}
      size={size}
      id={id}
      label={label}
      value={value}
      name={name}
      type={showPassword ? "text" : "password"}
      onChange={onChange}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default PasswordField;
