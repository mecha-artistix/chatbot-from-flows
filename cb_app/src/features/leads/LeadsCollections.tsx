import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Button,
} from '@mui/material';
import CreateNewBtn from './components/CreateNewBtn';
import ImportFileBtn from './components/ImportFileBtn';
import { DataGrid } from '@mui/x-data-grid';
import CallBtn from './components/CallBtn';
import { getLeadsCollections, uploadLeadsData } from './services';
import { useLoaderData, useNavigate } from 'react-router-dom';
// import Checkbox from '@mui/material/Checkbox';

const columns = [
  { field: 'name', headerName: 'Collection Name', flex: 1 },
  { field: 'createdAt', headerName: 'Created Date', width: 200 },
];

function LeadsCollections() {
  const initData = useLoaderData();
  const [data, setData] = useState([...initData.data]);
  const [rows, setRows] = useState<Row[]>([]);
  const [selectedRow, setSelectedRow] = useState({});
  const [checked, setChecked] = useState(0);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const navigate = useNavigate();
  const handleFileLoad = async (csvData) => {
    // setFile(csvData);
    // const res = await uploadLeadsData(file);
  };

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

  function handleRowClick(params) {
    console.log(params);
    navigate(`/leads-collections/${params.id}`);
  }

  return (
    <Container maxWidth="xl">
      <Stack direction="row" sx={style.container}>
        <CreateNewBtn />
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
          // onPaginationModelChange={(newPaginationModel) => {
          //   setPaginationModel(newPaginationModel);
          // }}
        />
        <Stack direction="row">
          <CallBtn />
          {/* <Button onClick={() => navigate(`/leads-collections/${id}`)}>View Leads</Button> */}
        </Stack>
      </Container>
    </Container>
  );
}

export default LeadsCollections;

export async function loader() {
  const leadsCollections = await getLeadsCollections();
  return leadsCollections.data;
}
interface Row {
  name: string;
  createdAt: string;
}
interface APIResponseLeadsCollection {
  data: { _id: string; user: string; name: string; leads: any[]; createdAt: string };
}

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
