import { useEffect, useState } from 'react';
import { Container, Stack } from '@mui/material';
import ImportFileBtn from './components/ImportFileBtn';
import { DataGrid, GridRowParams, GridRowSelectionModel } from '@mui/x-data-grid';
import { getLeadsCollections } from './services';
import { LoaderFunction, useLoaderData, useNavigate } from 'react-router-dom';
// import Checkbox from '@mui/material/Checkbox';

const columns = [
  { field: 'name', headerName: 'Collection Name', flex: 1 },
  { field: 'createdAt', headerName: 'Created Date', width: 200 },
];

const LeadsCollections: React.FC = () => {
  const initData = useLoaderData() as IInitData;
  const [data, setData] = useState<ILeadCollection[]>([...initData.data.data]);
  const [rows, setRows] = useState<Row[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setRows(() => {
      let rows: Row[] = [];
      data.forEach((obj, i) => {
        const { _id, name, createdAt } = obj;
        const row = { id: _id, name, createdAt };
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

  function handleRowClick(params: GridRowParams) {
    navigate(`/leads-collections/${params.id}`);
  }

  function handleSelectionChange(params: GridRowSelectionModel) {
    console.log(params);
  }

  return (
    <Container maxWidth="xl">
      <Stack direction="row" sx={style.container}>
        <ImportFileBtn setData={setData} />
      </Stack>
      <Container>
        <DataGrid
          columns={columns}
          rows={rows}
          pagination
          autoHeight
          pageSizeOptions={[5, 25, 50, 100]}
          density="comfortable"
          initialState={{}}
          checkboxSelection
          disableRowSelectionOnClick
          onRowClick={handleRowClick}
          onRowSelectionModelChange={handleSelectionChange}

          // onPaginationModelChange={(newPaginationModel) => {
          //   setPaginationModel(newPaginationModel);
          // }}
        />
        <Stack direction="row">
          {/* <CallBtn /> */}
          {/* <Button onClick={() => navigate(`/leads-collections/${id}`)}>View Leads</Button> */}
        </Stack>
      </Container>
    </Container>
  );
};

export default LeadsCollections;

export const loader: LoaderFunction = async () => {
  const leadsCollections = await getLeadsCollections();
  console.log(leadsCollections);
  return leadsCollections;
};

interface IInitData {
  status: string;
  results: number;
  data: {
    data: ILeadCollection[];
  };
}

export interface ILeadCollection {
  _id: string;
  user: string;
  createdAt: string;
  leads: string[];
  name: string;
}

interface Row {
  name: string;
  createdAt: string;
}

// interface APIResponseLeadsCollection {
//   data: { _id: string; user: string; name: string; leads: any[]; createdAt: string };
// }

/*

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

    return (
    <Container maxWidth="xl">
      <Stack direction="row" sx={style.container}>
        <CreateNewBtn />
        <ImportFileBtn setFile={setFile} onFileLoad={handleFileLoad} />
      </Stack>
      <Container>
        <TableContainer component={Paper}>
          <Table aria-label="Leads Collections" size="medium">
            <TableHead>
              <TableRow>
                <TableCell>
                  <Checkbox checked={isAllSelected} onChange={headCheckHandler} />
                </TableCell>
                {columns.map((el, i) => (
                  <TableCell key={i}>{el.label}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, i) => (
                <TableRow key={i} onClick={() => setSelectedRow(row)}>
                  <TableCell>
                    <Checkbox color="primary" checked={i === checked} onChange={() => checkHandler(i)} />
                  </TableCell>
                  {columns.map((col, i) => (
                    <TableCell key={i}>{row[col.name]}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
      <Box sx={{ m: 2 }}>
        <CallBtn />
      </Box>
    </Container>
  );
  
  
*/
