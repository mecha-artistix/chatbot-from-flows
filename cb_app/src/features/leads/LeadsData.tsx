import { useEffect, useState } from 'react';
import { Container, Stack } from '@mui/material';
import CreateNewBtn from './components/CreateNewBtn';
import ImportFileBtn from './components/ImportFileBtn';
import { DataGrid } from '@mui/x-data-grid';
import CallBtn from './components/CallBtn';

function LeadsData() {
  const [data, setData] = useState([]);

  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });

  const handleFileLoad = (csvData) => {
    setData(csvData);
  };

  useEffect(() => {
    console.log(columns);
  }, [rows, columns]);

  const style = {
    container: {
      margin: '20px auto',
      p: 2,
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: 2,
    },
  };

  return (
    <Container maxWidth="xl">
      <Stack direction="row" sx={style.container}>
        <CreateNewBtn />
        <ImportFileBtn onFileLoad={handleFileLoad} setColumns={setColumns} setRows={setRows} />
      </Stack>
      <Container>
        <DataGrid
          columns={columns}
          rows={rows}
          pagination
          autoHeight
          pageSizeOptions={[5, 25, 50, 100]}
          density="compact"
          initialState={{}}
          checkboxSelection
          disableRowSelectionOnClick
          onPaginationModelChange={(newPaginationModel) => {
            setPaginationModel(newPaginationModel);
          }}
        />
        <CallBtn />
      </Container>
    </Container>
  );
}

export default LeadsData;
