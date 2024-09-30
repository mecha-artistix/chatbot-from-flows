import { useEffect, useState } from 'react';
import { Box, Container, Stack } from '@mui/material';
import {
  DataGrid,
  GridCallbackDetails,
  GridRowSelectionModel,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
} from '@mui/x-data-grid';
import CallBtn from './components/CallBtn';
import { LoaderFunction, useLoaderData } from 'react-router-dom';
import { getLeads } from './services';
import CreateNewLead from './components/CreateNewLead';

const columns = [
  { field: 'name', headerName: 'Name', flex: 1, sortable: false },
  { field: 'email', headerName: 'Email', flex: 1, sortable: false },
  { field: 'phone', headerName: 'Phone', flex: 1, sortable: false },
];

function Leads() {
  const initData = useLoaderData() as IInitData;
  // const [leads, setLeads] = useState<ILead[]>([...initData.data.data.leads]);
  const [rows, setRows] = useState<Row[]>([]);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 });
  const [callNum, setCallNum] = useState<string[]>([]);

  useEffect(() => {
    setRows(() => {
      let rows: Row[] = [];
      initData.data.data.leads.forEach((obj) => {
        const { _id, name, email, phone, createdAt } = obj;
        const row = { id: _id, name, email, phone, createdAt };
        rows.push(row);
      });

      return rows;
    });
  }, [initData.data.data.leads]);

  const style = {
    container: {
      margin: '20px auto',
      p: 2,
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: 2,
    },
  };

  function handleSelectionChange(rowSelectionModel: GridRowSelectionModel, details: GridCallbackDetails) {
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
        <CreateNewLead setRows={setRows} />
        <CallBtn numbersToCall={callNum} />
      </Stack>
      <Container sx={{ height: '700px' }}>
        <DataGrid
          disableColumnMenu
          initialState={{ pagination: { paginationModel } }}
          columns={columns}
          rows={rows}
          pagination
          pageSizeOptions={[5, 25, 50, 100]}
          checkboxSelection
          onRowSelectionModelChange={handleSelectionChange}
          disableRowSelectionOnClick
          density="compact"
          sx={{ border: 0 }}
          paginationModel={paginationModel}
          onPaginationModelChange={(newPaginationModel) => {
            setPaginationModel(newPaginationModel);
          }}
          slots={{ toolbar: Toolbar }}
        />
      </Container>
    </Container>
  );
}

export default Leads;

const Toolbar = () => {
  return (
    <GridToolbarContainer
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        padding: 2,
      }}
    >
      <Box>
        <GridToolbarFilterButton />
      </Box>
      <Box>
        <GridToolbarExport />
      </Box>
    </GridToolbarContainer>
  );
};

export const loader: LoaderFunction = async function ({ params }) {
  const { id } = params;
  if (!id) return;
  const leads = await getLeads(id);
  console.log('leads from loader', leads);
  return leads;
};

export interface Row {
  name?: string;
  email?: string;
  phone?: string;
}

interface ILead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

interface IInitData {
  status: string;
  totalLeads: number;
  data: {
    data: {
      leads: ILead[];
    };
  };
}
