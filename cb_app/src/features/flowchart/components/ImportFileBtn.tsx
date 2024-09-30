import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function ImportFileBtn() {
  return (
    <Button
      sx={{ zIndex: 0, position: 'relative' }}
      component="label"
      role={undefined}
      variant="outlined"
      tabIndex={-1}
      startIcon={<CloudUploadIcon />}
    >
      Import file
      <VisuallyHiddenInput
        type="file"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => event.target.files}
        multiple
      />
    </Button>
  );
}
