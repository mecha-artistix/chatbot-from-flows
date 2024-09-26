import { useEffect, useState } from 'react';
import { Button, Container, Stack } from '@mui/material';
import ImportFileBtn from './components/ImportFileBtn';
import { DataGrid } from '@mui/x-data-grid';
import CallBtn from './components/CallBtn';
import { useLoaderData, useParams } from 'react-router-dom';
import { createLead, getLeads } from './services';
import CreateNewLead from './components/CreateNewLead';

const columns = [
  { field: 'name', headerName: 'Name', flex: 1 },
  { field: 'email', headerName: 'Email', flex: 1 },
  { field: 'phone', headerName: 'Phone', flex: 1 },
];

function Leads() {
  const initData = useLoaderData();
  const [data, setData] = useState(initData);
  // console.log(data);

  const [leads, setLeads] = useState([...initData.data.data.leads]);
  const [leadsCount, setLeadsCount] = useState(initData.totalLeads);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 });
  const [callNum, setCallNum] = useState([]);
  const [collection, setCollection] = useState({ _id: initData.data.data._id, name: initData.data.data.name });

  const handleFileLoad = (csvData) => {};

  useEffect(() => {
    // console.log(collection);
  }, []);

  useEffect(() => {
    // console.log(data);

    // setLeads((prev) => [...prev, ...data.data.data.leads]);

    setRows(() => {
      let rows: Row[] = [];
      console.log(leads.length);
      console.log(leads);
      // data.data.data.leads.forEach((obj, i) => {
      leads.forEach((obj, i) => {
        const { _id, name, email, phone, createdAt } = obj;
        const row = { id: _id, name, email, phone, createdAt };
        rows.push(row);
      });

      return rows;
    });
  }, [leads]);

  const style = {
    container: {
      // position: 'fixed',
      margin: '20px auto',
      p: 2,
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: 2,
    },
  };

  function handleSelectionChange(rowSelectionModel, details) {
    if (rowSelectionModel.length) {
      console.log('rowSelectionModel', rowSelectionModel, 'details', details);
      const phone = details.api.getCellValue(rowSelectionModel[rowSelectionModel.length - 1], 'phone');
      setCallNum((prev) => [...prev, phone]);
      console.log(phone);
    }
  }

  return (
    <Container maxWidth="xl">
      <Stack direction="row" sx={style.container}>
        <CreateNewLead setLeads={setLeads} setRows={setRows} />
        <CallBtn numbersToCall={callNum} />
      </Stack>
      <Container>
        <DataGrid
          disableColumnMenu
          initialState={{ pagination: { paginationModel } }}
          columns={columns}
          rows={rows}
          autoHeight
          pagination
          pageSizeOptions={[5, 25, 50, 100]}
          checkboxSelection
          onRowSelectionModelChange={handleSelectionChange}
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

// const CreateNewBtn = ({ collectionId, phone, email, name }) => {
//   const handleCreateNew = async () => {
//     console.log(collectionId);
//     const body = { name, email, phone, dataSource: collectionId };
//     const newLead = await createLead(body);
//   };
//   return (
//     <Button onClick={handleCreateNew} variant="contained">
//       Create New Lead
//     </Button>
//   );
// };
