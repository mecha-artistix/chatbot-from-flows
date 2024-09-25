import { useEffect, useState } from 'react';
import { Container, Stack } from '@mui/material';
import CreateNewBtn from './components/CreateNewBtn';
import ImportFileBtn from './components/ImportFileBtn';
import { DataGrid } from '@mui/x-data-grid';
import CallBtn from './components/CallBtn';
import { useLoaderData } from 'react-router-dom';
import { getLeads } from './services';

const columns = [
  { field: 'name', headerName: 'Name', flex: 1 },
  { field: 'email', headerName: 'Email', flex: 1 },
  { field: 'phone', headerName: 'Phone', flex: 1 },
];

function Leads() {
  const initData = useLoaderData();

  const [leads, setLeads] = useState();
  const [data, setData] = useState(initData);
  const [leadsCount, setLeadsCount] = useState(initData.totalLeads);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 });

  const handleFileLoad = (csvData) => {};

  useEffect(() => {
    setLeads(data.data.data.leads);
  }, [data]);

  useEffect(() => {
    setRows(() => {
      let rows: Row[] = [];
      data.data.data.leads.forEach((obj, i) => {
        const { _id, name, email, phone } = obj;
        const row = { id: _id, name, email, phone };
        rows.push(row);
      });

      return rows;
    });
  }, [data]);
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
        {/* <ImportFileBtn setData={setData} /> */}
      </Stack>
      <Container>
        <DataGrid
          initialState={{ pagination: { paginationModel } }}
          columns={columns}
          rows={rows}
          autoHeight
          pagination
          pageSizeOptions={[5, 25, 50, 100]}
          checkboxSelection
          disableRowSelectionOnClick
          // rowCount={leadsCount}
          density="compact"
          sx={{ border: 0 }}
          paginationModel={paginationModel}
          loading={loading}
          onPaginationModelChange={(newPaginationModel) => {
            setPaginationModel(newPaginationModel);
          }}
        />
        <CallBtn />
      </Container>
    </Container>
  );
}

export default Leads;

export async function loader({ params }) {
  const { id } = params;
  const leads = await getLeads(id);
  return leads;
}

interface Row {
  name?: string;
  email?: string;
  phone?: string;
}
