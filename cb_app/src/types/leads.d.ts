import { GridFilterModel, GridPaginationModel, GridSortItem, GridSortModel } from "@mui/x-data-grid";

export interface ILeadsStore {
  leadsCollection?: any[];
  paginationModel: GridPaginationModel;
  setPaginationModel: (paginationModel: GridPaginationModel) => void;
  sortModel: GridSortModel;
  setSortModel: (sortModel: GridSortModel) => void;
  filterModel: GridFilterModel;
  setFilterModel: (filterModel: GridFilterModel) => void;
}
