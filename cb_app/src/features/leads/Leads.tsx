import { useEffect, useState } from "react";
import { Box, Container, Stack } from "@mui/material";
import {
  DataGrid,
  GridCallbackDetails,
  GridColDef,
  GridRowSelectionModel,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import CallBtn from "./components/CallBtn";
import { LoaderFunction, useLoaderData, useParams } from "react-router-dom";
import { createLead, getLeads } from "./services";
import CreateNew from "../../components/createNew/CreateNew";

const columns: GridColDef[] = [
  { field: "name", headerName: "Name", flex: 1, sortable: false },
  { field: "email", headerName: "Email", flex: 1, sortable: false },
  { field: "phone", headerName: "Phone", flex: 1, sortable: false },
];

function Leads() {
  const initData = useLoaderData() as IInitData;
  // const [leads, setLeads] = useState<ILead[]>([...initData.data.data.leads]);
  const { id } = useParams();
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
      margin: "20px auto",
      p: 2,
      justifyContent: "space-between",
      alignItems: "center",
      boxShadow: 2,
    },
  };

  function handleSelectionChange(rowSelectionModel: GridRowSelectionModel, details: GridCallbackDetails) {
    if (rowSelectionModel.length) {
      console.log("rowSelectionModel", rowSelectionModel, "details", details);
      const phone = details.api.getCellValue(rowSelectionModel[rowSelectionModel.length - 1], "phone");
      setCallNum((prev) => [...prev, phone]);
      console.log(phone);
    }
  }

  function handleSetRows(responseData: Record<string, any>) {
    setRows((prev) => {
      const { _id, name, email, phone, createdAt } = responseData.data.data;
      const row = { id: _id, name, email, phone, createdAt };
      return [row, ...prev];
    });
  }

  return (
    <Container maxWidth="xl">
      <Stack direction="row" sx={style.container}>
        {/* <CreateNewLead setRows={setRows} /> */}
        <CreateNew
          data={{ leadsCollection: id }}
          fields={[
            { name: "name", type: "text" },
            { name: "phone", type: "text" },
            { name: "email", type: "email " },
          ]}
          onSubmit={createLead}
          setRows={handleSetRows}
        >
          Create New Lead
        </CreateNew>
        <CallBtn numbersToCall={callNum} />
      </Stack>
      <Container sx={{ height: "700px" }}>
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
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
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
  console.log("leads from loader", leads);
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
