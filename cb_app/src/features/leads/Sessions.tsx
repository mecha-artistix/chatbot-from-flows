import { DataGrid } from '@mui/x-data-grid';
import useLeadsStore from './leadsStore';
import { Box, Container } from '@mui/material';
import {
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';
import { LoaderFunction, Outlet, useLoaderData } from 'react-router-dom';
import { getSessions } from './services';
import { ILeadsStore } from '../../types/leads';

const Sessions = () => {
  const sessions = useLoaderData() as ISession[];
  const { paginationModel, setPaginationModel } = useLeadsStore((state) => ({
    paginationModel: state.paginationModel,
    setPaginationModel: state.setPaginationModel,
  }));

  const columns = [
    { field: 'sessionId', headerName: 'Session ID', width: 200 },
    { field: 'intent', headerName: 'Intent', width: 150 },
    { field: 'createdAt', headerName: 'Created At', width: 200 },
  ];

  return (
    <Container maxWidth="lg">
      <Outlet />
      <Container maxWidth="lg">
        <DataGrid
          rowSelection={false}
          rows={sessions.map((session) => ({ ...session, id: session._id }))}
          columns={columns}
          pagination
          autoHeight
          // loading={loading}
          rowCount={sessions.length}
          paginationMode="server"
          pageSizeOptions={[5, 25, 50, 100]}
          paginationModel={paginationModel}
          slots={{ toolbar: Toolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          density="compact"
          onPaginationModelChange={(newPaginationModel) => {
            console.log(newPaginationModel);
            setPaginationModel(newPaginationModel);
            getSessions(newPaginationModel.page, newPaginationModel.pageSize);
          }}
          onSortModelChange={(newSortModel) => {
            console.log(newSortModel);
            // getSorted(newSortModel);
          }}
          onFilterModelChange={(newFilterModel) => {
            console.log(newFilterModel);
            // const key = newFilterModel.items[0].field;
            // const value = newFilterModel.items[0].value;
          }}
        />
      </Container>
    </Container>
  );
};

export default Sessions;

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
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
      </Box>
      <Box>
        <GridToolbarQuickFilter />
        <GridToolbarExport />
      </Box>
    </GridToolbarContainer>
  );
};

export const loader: LoaderFunction = async () => {
  const { paginationModel } = useLeadsStore.getState() as ILeadsStore;

  const page = paginationModel.page == 0 ? 1 : paginationModel.page;
  const limit = paginationModel.pageSize;

  const sessions = await getSessions(page, limit);

  return sessions;
};

interface ISession {
  _id: string;
  sessionId: string;
  intent: string;
  createdAt: string;
}
