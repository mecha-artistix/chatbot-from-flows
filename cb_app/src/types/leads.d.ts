import { GridPaginationModel } from '@mui/x-data-grid';

export interface ILeadsStore {
  leadsCollection?: any[];
  paginationModel: GridPaginationModel;
  setPaginationModel: (paginationModel: GridPaginationModel) => void;
}
