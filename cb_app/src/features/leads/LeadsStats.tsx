import { useState, useEffect } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import useLeadsStore from './leadsStore';
import { Box, Container, Stack, TextField } from '@mui/material';
import StatBox from './components/StatBox';
import GroupsIcon from '@mui/icons-material/Groups';
import {
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';
import { useLoaderData, useNavigation, useSearchParams } from 'react-router-dom';
import { getLeads } from './services';

const Leads = () => {
  const data = useLoaderData();
  const navigation = useNavigation();
  const isLoading = navigation.state === 'loading';
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    getLeads,
    leadsCollection,
    leadsCount,
    setLeadsCollection,
    loading,
    paginationModel,
    setPaginationModel,
    getSorted,
  } = useLeadsStore((state) => ({
    getLeads: state.getLeads,
    setLeadsCollection: state.setLeadsCollection,
    leadsCollection: state.leadsCollection,
    loading: state.loading,
    leadsCount: state.leadsCount,
    paginationModel: state.paginationModel,
    setPaginationModel: state.setPaginationModel,
    getSorted: state.getSorted,
  }));
  // const [notes, setNotes] = useState({});
  // const [page, setPage] = useState(0);
  // //   const [paginationModel, setPaginationModel] = useState({
  // //     page: 0,
  // //     pageSize: 5,
  // //   });

  // // Handle note change for a specific row
  // const handleNoteChange = (id, value) => {
  //   setNotes((prevNotes) => ({
  //     ...prevNotes,
  //     [id]: value,
  //   }));
  // };

  const columns = [
    { field: 'sessionId', headerName: 'Session ID', width: 200 },
    { field: 'intent', headerName: 'Intent', width: 150 },
    { field: 'createdAt', headerName: 'Created At', width: 200 },
  ];

  useEffect(() => {
    console.log(leadsCollection);
    setLeadsCollection(data);
  }, []);

  return (
    <Container maxWidth="lg">
      <Stats />
      <Container maxWidth="lg">
        <DataGrid
          rowSelection={false}
          rows={leadsCollection.map((lead, index) => ({ ...lead, id: lead._id }))}
          columns={columns}
          pagination
          autoHeight
          paginationMode="server"
          loading={loading}
          rowCount={leadsCount}
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
          initialState={{}}
          onPaginationModelChange={(newPaginationModel) => {
            setPaginationModel(newPaginationModel);
            getLeads(newPaginationModel.page, newPaginationModel.pageSize);
          }}
          onSortModelChange={(newSortModel) => {
            getSorted(newSortModel);
          }}
          onFilterModelChange={(newFilterModel) => {
            const key = newFilterModel.items[0].field;
            const value = newFilterModel.items[0].value;
          }}
        />
      </Container>
    </Container>
  );
};

const Stats = () => {
  return (
    <Stack direction="row" spacing={2} py={2}>
      <StatBox
        name="Total Leads"
        stat="total_leads"
        icon={<GroupsIcon sx={(theme) => ({ color: theme.palette.primary.dark, fontSize: '46px' })} />}
      />
      <StatBox
        name="Successful"
        stat="successful"
        icon={<GroupsIcon sx={(theme) => ({ color: theme.palette.primary.dark, fontSize: '46px' })} />}
      />
      <StatBox
        name="Unsuccessful"
        stat="unsuccessful"
        icon={<GroupsIcon sx={(theme) => ({ color: theme.palette.primary.dark, fontSize: '46px' })} />}
      />
      <StatBox
        name="Call Later"
        stat="call_later"
        icon={<GroupsIcon sx={(theme) => ({ color: theme.palette.primary.dark, fontSize: '46px' })} />}
      />
    </Stack>
  );
};

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

// export const loader = async ({ request }) => {
//   const url = new URL(request.url);
//   const searchParams = url.searchParams;
//   console.log(url.searchParams);
//   const page = parseInt(searchParams.get('page') || '1', 10);
//   const limit = parseInt(searchParams.get('limit') || '25', 10);
//   const sort = searchParams.get('sort') || 'createdAt';
//   console.log(page, limit, sort);

//   const leads = await getLeads(page, limit, sort);
//   return leads;
// };

export const loader = async () => {
  const { paginationModel } = useLeadsStore.getState();
  // const url = new URL(request.url);
  // const searchParams = url.searchParams;
  // console.log(url.searchParams);
  // const page = parseInt(searchParams.get('page') || '1', 10);
  // const limit = parseInt(searchParams.get('limit') || '25', 10);
  // const sort = searchParams.get('sort') || 'createdAt';
  // console.log(page, limit, sort);
  const page = paginationModel.page == 0 ? 1 : paginationModel.page;
  const limit = paginationModel.pageSize;
  const leads = await getLeads(page, limit);
  return leads;
};
