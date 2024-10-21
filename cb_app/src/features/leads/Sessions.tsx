import {
  DataGrid,
  GridColDef,
  GridFilterInputValueProps,
  GridFilterItem,
  GridFilterModel,
  GridFilterOperator,
  GridPaginationModel,
  GridSortModel,
} from "@mui/x-data-grid";
import useLeadsStore from "./leadsStore";
import { Autocomplete, Box, Checkbox, Container, FormControl, TextField, Typography } from "@mui/material";
import {
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import { LoaderFunction, Outlet, useLoaderData } from "react-router-dom";
import { getSessions } from "./services";
import { ILeadsStore } from "../../types/leads";
import { useState } from "react";

type THandlePaginationChange = (
  newPaginationModel: GridPaginationModel,
  newSortModel: GridSortModel,
  newFilterModel: GridFilterModel,
) => Promise<void>;

const Sessions = () => {
  const data = useLoaderData() as { [key: string]: any };
  const [sessions, setSessions] = useState<Record<string, any>[]>(data.data.data);
  const totalSessions = data.total;
  const [loading, setLoading] = useState(false);
  const [selectedIntents, setSelectedIntents] = useState<string[]>([]);
  const { paginationModel, setPaginationModel, sortModel, setSortModel, filterModel, setFilterModel } = useLeadsStore(
    (state) => ({
      paginationModel: state.paginationModel,
      setPaginationModel: state.setPaginationModel,
      sortModel: state.sortModel,
      setSortModel: state.setSortModel,
      filterModel: state.filterModel,
      setFilterModel: state.setFilterModel,
    }),
  );

  const columns: GridColDef[] = [
    { field: "toFormatted", headerName: "Called Phone", width: 200 },
    { field: "sid", headerName: "Session ID", width: 100 },
    { field: "status", headerName: "Status", width: 100 },
    {
      field: "duration",
      headerName: "Duration",
      width: 100,
      type: "number",
      valueFormatter: (params: string) => params + " sec",
      filterOperators: [
        {
          label: "Greater than",
          value: "greaterThan",
          getApplyFilterFn: (filterItem: GridFilterItem) => {
            if (filterItem.value === undefined || filterItem.value === null) return null;
            return ({ value }: { value: number }) => value > Number(filterItem.value);
          },
          InputComponent: NumberInputComponent, // Optional: Custom input component
        },
        {
          label: "Less than",
          value: "lessThan",
          getApplyFilterFn: (filterItem: GridFilterItem) => {
            if (filterItem.value === undefined || filterItem.value === null) return null;
            return ({ value }: { value: number }) => value < Number(filterItem.value);
          },
          InputComponent: NumberInputComponent, // Optional: Custom input component
        },
        {
          label: "Equal to",
          value: "equalTo",
          getApplyFilterFn: (filterItem: GridFilterItem) => {
            if (filterItem.value === undefined || filterItem.value === null) return null;
            return ({ value }: { value: number }) => value === Number(filterItem.value);
          },
          InputComponent: NumberInputComponent, // Optional: Custom input component
        },
      ],
    },
    {
      field: "intent",
      headerName: "Intent",
      width: 150,
      // Removed valueOptions to prevent type mismatch
      filterable: false, // Filtering handled via CustomToolbar
      sortable: false,
    },
    {
      field: "dateUpdated",
      headerName: "Date",
      width: 200,
      valueFormatter: (params: string) => new Date(params).toLocaleString("sv"),
    },
  ];

  const handlePaginationChange: THandlePaginationChange = async (
    newPaginationModel,
    newSortModel = sortModel,
    newFilterModel = filterModel,
  ) => {
    // sort = '-dateUpdated'
    const sort = `${newSortModel[0].sort == "asc" ? "" : "-"}${newSortModel[0].field}`;
    // Initialize filter parameters
    const filters: Record<string, any> = {};

    // Iterate over each filter item
    newFilterModel.items.forEach((filterItem: GridFilterItem) => {
      if (filterItem.value) {
        if (filterItem.field === "duration") {
          switch (filterItem.operator) {
            case "greaterThan":
              filters["duration"] = { ...filters["duration"], $gt: Number(filterItem.value) };
              break;
            case "lessThan":
              filters["duration"] = { ...filters["duration"], $lt: Number(filterItem.value) };
              break;
            case "equalTo":
              filters["duration"] = { ...filters["duration"], $eq: Number(filterItem.value) };
              break;
            default:
              break;
          }
        }
        // Other fields can be handled here
        else {
          // For fields like 'intent', filtering is handled via CustomToolbar
          // So, no action needed here if filterable is set to false
        }
      }
    });

    // Handle selected intents from CustomToolbar
    if (selectedIntents.length > 0) {
      filters["intent"] = { $in: selectedIntents };
    }

    console.log("Sort:", sort, "Filters:", filters);

    try {
      console.log(newPaginationModel, sortModel);
      setLoading(true);
      setPaginationModel(newPaginationModel);
      setSortModel(newSortModel);
      setFilterModel(newFilterModel);
      const response = await getSessions(newPaginationModel.page, newPaginationModel.pageSize, sort, filters);
      setSessions(response.data.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   const intentFilterItem: GridFilterItem | null =
  //     selectedIntents.length > 0
  //       ? {
  //           field: "intent",
  //           operator: "isAnyOf", // Custom operator (handled manually)
  //           value: selectedIntents,
  //         }
  //       : null;

  //   let newFilterItems = [...filterModel.items.filter((item) => item.field !== "intent")];
  //   if (intentFilterItem) {
  //     newFilterItems.push(intentFilterItem);
  //   }

  //   setFilterModel({ items: newFilterItems });
  // }, [filterModel.items, paginationModel, sortModel]);

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
          loading={loading}
          rowCount={totalSessions}
          paginationMode="server"
          filterMode="server"
          pageSizeOptions={[5, 25, 50, 100]}
          paginationModel={paginationModel}
          sortModel={sortModel}
          slots={{ toolbar: Toolbar }}
          components={{ Toolbar: CustomToolbar }}
          componentsProps={{
            toolbar: {
              selectedIntents,
              setSelectedIntents,
            },
          }}
          density="compact"
          onPaginationModelChange={(newPaginationModel) =>
            handlePaginationChange(newPaginationModel, sortModel, filterModel)
          }
          onSortModelChange={(newSortModel) => handlePaginationChange(paginationModel, newSortModel, filterModel)}
          onFilterModelChange={(newFilterModel) => {
            handlePaginationChange(paginationModel, sortModel, newFilterModel);
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
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
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
  const { paginationModel, sortModel, filterModel } = useLeadsStore.getState() as ILeadsStore;

  const page = paginationModel.page == 0 ? 1 : paginationModel.page;
  const limit = paginationModel.pageSize;
  const sort = `${sortModel[0].sort == "asc" ? "" : "-"}${sortModel[0].field}`;
  const filter = filterModel.items;
  const sessions = await getSessions(page, limit, sort, filter);

  return sessions;
};

interface CustomToolbarProps {
  selectedIntents: string[];
  setSelectedIntents: (intents: string[]) => void;
}

const intentOptions = ["XFER", "DAIR", "DNQ", "CallBK", "DNC", "NI", "NP", "A", "Hang_Up", "LB"];

const CustomToolbar: React.FC<CustomToolbarProps> = ({ selectedIntents, setSelectedIntents }) => {
  return (
    <GridToolbarContainer>
      <Box display="flex" alignItems="center" gap={2} padding={1}>
        <Typography variant="subtitle1">Filter by Intent:</Typography>
        <Autocomplete
          multiple
          options={intentOptions}
          value={selectedIntents}
          onChange={(event, newValue) => {
            setSelectedIntents(newValue);
          }}
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox style={{ marginRight: 8 }} checked={selected} />
              {option}
            </li>
          )}
          renderInput={(params) => (
            <TextField {...params} variant="outlined" placeholder="Select intents" size="small" />
          )}
          style={{ minWidth: 300 }}
        />
        {/* Existing Quick Filter */}
        <Box flexGrow={1} />
        {/* You can add other toolbar items here if needed */}
      </Box>
    </GridToolbarContainer>
  );
};

export { CustomToolbar };

const NumberInputComponent: React.FC<GridFilterInputValueProps> = (props) => {
  const { item, applyValue } = props;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    applyValue({ ...item, value: event.target.value });
  };

  return (
    <TextField
      type="number"
      value={item.value ?? ""}
      onChange={handleChange}
      variant="standard"
      size="small"
      InputProps={{ inputProps: { min: 0 } }}
    />
  );
};

export { NumberInputComponent };
/*

      filterOperators: [
        {
          label: "Greater than",
          value: "greaterThan",
          getApplyFilterFn: (filterItem: GridFilterItem) => {
            if (!filterItem.value) return null;
            return ({ value }: { value: number }) => value > Number(filterItem.value);
          },
        },
        {
          label: "Less than or equal to",
          value: "lessThanOrEqual",
          getApplyFilterFn: (filterItem: GridFilterItem) => {
            if (!filterItem.value) return null;
            return ({ value }: { value: number }) => value <= Number(filterItem.value);
          },
        },
      ],

newFilterModel.items.reduce(
      (acc, filterItem: GridFilterItem) => {
        if (filterItem.value) {
          // Handle numerical filters with operators if necessary
          if (filterItem.field === "duration") {
            if (filterItem.operator === "greaterThan") {
              acc["duration"] = { $gt: Number(filterItem.value) };
            } else if (filterItem.operator === "lessThanOrEqual") {
              acc["duration"] = { $lte: Number(filterItem.value) };
            }
          } else {
            acc[filterItem.field] = filterItem.value;
          }
        }
        return acc;
      },
      {} as Record<string, any>,
    );

// interface ISession {
//   _id: string;
//   sessionId: string;
//   intent: string;
//   createdAt: string;
// }

// Custom Filter Input Component
const MultipleIntentFilter = (props: GridFilterInputValueProps) => {
  const { item, applyValue } = props;

  const handleChange = (event: any, values: string[]) => {
    applyValue({ ...item, value: values });
  };

  return (
    <FormControl fullWidth>
      <Autocomplete
        multiple
        options={["XFER", "DAIR", "DNQ", "CallBK", "DNC", "NI", "NP", "A", "Hang_Up", "LB"]}
        value={item.value || []}
        onChange={handleChange}
        renderOption={(props, option, { selected }) => (
          <li {...props}>
            <Checkbox style={{ marginRight: 8 }} checked={selected} />
            {option}
          </li>
        )}
        renderInput={(params) => <TextField {...params} variant="standard" />}
      />
    </FormControl>
  );
};

// Define the custom filter operator
const isAnyOfOperator: GridFilterOperator = {
  label: "Is any of",
  value: "isAnyOf",
  getApplyFilterFn: (filterItem: GridFilterItem) => {
    if (!filterItem.value || filterItem.value.length === 0) return null;
    const values = filterItem.value;
    return ({ value }) => values.includes(value);
  },
  InputComponent: MultipleIntentFilter,
};


*/
