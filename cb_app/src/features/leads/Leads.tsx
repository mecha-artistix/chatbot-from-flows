import { useEffect, useState } from 'react';
import { Container, Stack } from '@mui/material';
import { DataGrid, GridCallbackDetails, GridRowSelectionModel } from '@mui/x-data-grid';
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
  const [leads, setLeads] = useState<ILead[]>([...initData.data.data.leads]);
  const [rows, setRows] = useState<Row[]>([]);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 });
  const [callNum, setCallNum] = useState<string[]>([]);

  useEffect(() => {
    setRows(() => {
      let rows: Row[] = [];
      console.log(leads.length);
      console.log(leads);
      leads.forEach((obj) => {
        const { _id, name, email, phone, createdAt } = obj;
        const row = { id: _id, name, email, phone, createdAt };
        rows.push(row);
      });

      return rows;
    });
  }, [leads]);

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
          density="compact"
          sx={{ border: 0 }}
          paginationModel={paginationModel}
          onPaginationModelChange={(newPaginationModel) => {
            setPaginationModel(newPaginationModel);
          }}
        />
      </Container>
    </Container>
  );
}

export default Leads;

export const loader: LoaderFunction = async function ({ params }) {
  const { id } = params;
  if (!id) return;
  const leads = await getLeads(id);
  console.log('leads from loader', leads);
  return leads;
};
// type TLoader = ({ params }: TLoaderParams) => Promise<{ [key: string]: any }>;

// type TLoaderParams = {
//   [key: string]: any;
// };

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
