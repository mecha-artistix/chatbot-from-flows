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

const Leads = () => {
  const { getLeads, leadsCount, leadsCollection, loading, paginationModel, setPaginationModel, getSorted } =
    useLeadsStore((state) => ({
      getLeads: state.getLeads,
      leadsCollection: state.leadsCollection,
      loading: state.loading,
      leadsCount: state.leadsCount,
      paginationModel: state.paginationModel,
      setPaginationModel: state.setPaginationModel,
      getSorted: state.getSorted,
    }));
  const [notes, setNotes] = useState({});
  const [page, setPage] = useState(0);
  //   const [paginationModel, setPaginationModel] = useState({
  //     page: 0,
  //     pageSize: 5,
  //   });

  // Handle note change for a specific row
  const handleNoteChange = (id, value) => {
    setNotes((prevNotes) => ({
      ...prevNotes,
      [id]: value,
    }));
  };

  // Define columns for DataGrid
  const columns = [
    { field: 'sessionId', headerName: 'Session ID', width: 200 },
    { field: 'intent', headerName: 'Intent', width: 150 },
    { field: 'createdAt', headerName: 'Created At', width: 200 },
  ];

  useEffect(() => {
    getLeads(paginationModel.page, paginationModel.pageSize);
  }, []);

  return (
    <Container>
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
      <div style={{ width: '100%' }}>
        <DataGrid
          rowSelection={false}
          rows={leadsCollection.map((lead, index) => ({ ...lead, id: lead._id }))}
          columns={columns}
          pagination
          autoHeight
          paginationMode="server"
          loading={loading}
          rowCount={leadsCount}
          pageSizeOptions={[5, 10, 25, 50]}
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
            console.log(newPaginationModel);
            setPaginationModel(newPaginationModel);
            getLeads(newPaginationModel.page, newPaginationModel.pageSize);
          }}
          onSortModelChange={(newSortModel) => {
            // console.log(newSortModel[0].field);
            // console.log(newSortModel[0].sort);
            getSorted(newSortModel);
            // getLeads();
            // console.log(newSortModel);
          }}
          onFilterModelChange={(newFilterModel) => {
            console.log('filter');
            const key = newFilterModel.items[0].field;
            const value = newFilterModel.items[0].value;
          }}
        />
      </div>
    </Container>
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
