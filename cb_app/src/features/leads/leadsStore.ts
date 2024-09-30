import { create, StateCreator } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { ILeadsStore } from '../../types/leads';

const leadsStore: StateCreator<ILeadsStore> = (set) => ({
  paginationModel: { page: 1, pageSize: 25 },

  setPaginationModel: (paginationModel) => set({ paginationModel }),

  // setLeadsCollection: (data) => set({ leadsCollection: data }),

  // fetchLeads: async () => {
  //   try {
  //     set({ status: 'loading' });
  //     const response = await axios.get(URL);
  //     const leads = await response.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  //     set({ status: 'success', leadsCollection: leads });
  //   } catch (error) {
  //     set({ status: 'failed', error: error.message });
  //   }
  // },

  // hasMore: true,

  // leadsStatus: { total_leads: 0, successful: 0, unsuccessful: 0, call_later: 0 },
  // setPageSize: (pageSize) => set({ pageSize }),

  // getLeads: async (page, limit = 10) => {
  //   const { leadsCollection, paginationModel } = get();
  //   set((state) => ({ ...state, loading: true }));
  //   try {
  //     //http://localhost:5180/api/v2/leads?page=10&limit=10
  //     const response = await axios.get(`${URL}?page=${page}&limit=${limit}`);
  //     const data = await response.data;
  //     const leads = data.data.data;
  //     set((state) => ({
  //       ...state,
  //       loading: false,
  //       status: 'success',
  //       leadsCollection: [...leads],
  //       leadsCount: data.total,
  //       hasMore: leads.length > 0,
  //     }));
  //   } catch (error) {
  //     set((state) => ({ ...state, status: 'failed', error: error.message }));
  //   } finally {
  //     set((state) => ({ ...state, loading: false }));
  //   }
  // },

  // getSorted: async (options) => {
  //   const key = options[0].field;
  //   const value = options[0].sort;
  //   const sortBy = value == 'asc' ? '' : '-';
  //   const { paginationModel } = get();
  //   const respone = await axios.get(
  //     `${URL}?page=${paginationModel.page}&limit=${paginationModel.pageSize}&sort=${sortBy}${key}`,
  //   );
  //   const data = await respone.data;
  //   const leads = data.data.data;
  //   set((state) => ({
  //     ...state,
  //     loading: false,
  //     status: 'success',
  //     leadsCollection: [...leads],
  //     leadsCount: data.total,
  //   }));
  // },

  // getLeadsStatus: async () => {
  //   const response = await axios(URL + '/sessions/stats');
  //   const stats = response.data.stats;
  //   set((state) => ({
  //     ...state,
  //     leadsStatus: {
  //       total_leads: response.data.totalLeads,
  //       successful: stats.xfer,
  //       unsuccessful: stats.dnq + stats.dnc + stats.ni + stats.lb + stats.hang_up,
  //       call_later: stats.callbk + stats.a,
  //     },
  //   })); // response.data.stats
  // },

  // deleteLead: async (id) => {
  //   const { leadsCollection } = get();
  //   try {
  //     set({ status: 'loading' });
  //     await axios.delete(`${URL}/${id}`);
  //     set({
  //       status: 'deleted',
  //       leadsCollection: leadsCollection.filter((lead) => lead._id !== id),
  //     });
  //   } catch (error) {
  //     set({ status: 'failed', error: error.message });
  //   }
  // },
});

const useLeadsStore = create<ILeadsStore>()(
  devtools(persist(leadsStore, { name: 'LeadsStore', partialize: () => ({}) })),
);

export default useLeadsStore;
