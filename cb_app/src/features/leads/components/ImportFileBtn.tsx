import Papa from 'papaparse';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { uploadLeadsData } from '../services';
import { useState } from 'react';

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

export default function ImportFileBtn({ setData }) {
  const [file, setFile] = useState(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      const res = await uploadLeadsData(file);
      console.log(res);
      setData((prev) => [...prev, res.data.data]);
    }
  };
  return (
    <Button
      sx={{ zIndex: 0, position: 'relative' }}
      component="label"
      role={undefined}
      variant="outlined"
      tabIndex={-1}
      startIcon={<CloudUploadIcon />}
    >
      Import leads
      <VisuallyHiddenInput type="file" accept=".csv" onChange={handleFileUpload} multiple />
    </Button>
  );
}

/*

      // parse and display the data
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (result) => {
          const cols = result.meta.fields.map((field) => ({
            field: field,
            headerName: field.toUpperCase(),
            width: 150,
          }));
          const rows = result.data.map((row, index) => ({
            id: index + 1,
            ...row,
          }));
          setColumns(cols);
          setRows(rows);
        },
      });

      */
