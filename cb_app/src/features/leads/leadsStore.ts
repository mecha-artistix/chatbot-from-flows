import { create, StateCreator } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { ILeadsStore } from "../../types/leads";

const leadsStore: StateCreator<ILeadsStore> = (set) => ({
  paginationModel: { page: 1, pageSize: 25 },
  setPaginationModel: (paginationModel) => set({ paginationModel }),
  sortModel: [{ field: "dateUpdated", sort: "asc" }],
  setSortModel: (sortModel) => set({ sortModel }),
  filterModel: { items: [] },
  setFilterModel: (filterModel) => set({ filterModel }),
});

const useLeadsStore = create<ILeadsStore>()(
  devtools(persist(leadsStore, { name: "LeadsStore", partialize: () => ({}) })),
);

export default useLeadsStore;
