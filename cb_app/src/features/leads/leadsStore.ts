import { create } from 'zustand';
import { devtools, persist, StateCreator } from 'zustand/middleware';
import axios, { AxiosResponse } from 'axios';
import { ILeadsStore } from '../../types/leads';

const URL = import.meta.env.VITE_NODE_BASE_API + '/leads';

const leadsStore: StateCreator<ILeadsStore> = (set, get, api) => ({
  leadsCollection: [],
  status: '',
  error: '',
  leadsCount: 0,

  fetchLeads: async () => {
    try {
      set({ status: 'loading' });
      const response = await axios.get(URL);
      const leads = await response.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      set({ status: 'success', leadsCollection: leads });
    } catch (error) {
      set({ status: 'failed', error: error.message });
    }
  },

  hasMore: true,

  getLeads: async (page, limit = 10) => {
    const { leadsCollection } = get();
    try {
      //http://localhost:5180/api/v2/leads?page=10&limit=10
      const response = await axios.get(`${URL}?page=${page}&limit=${limit}`);
      //   console.log('response = ', response);
      const leads = await response.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      //   console.log(leads);
      set({
        status: 'success',
        leadsCollection: [...leadsCollection, ...leads],
        leadsCount: response.data.total,
        hasMore: leads.length > 0,
      });
    } catch (error) {
      console.log(error);
    }
  },

  addLead: (lead) => {
    set((state) => ({
      leadsCollection: [lead, ...state.leadsCollection],
    }));
  },

  deleteLead: async (id) => {
    const { leadsCollection } = get();
    console.log('leadsCollection after delete', leadsCollection);
    try {
      set({ status: 'loading' });
      await axios.delete(`${URL}/${id}`);
      set({ status: 'success' });

      set({
        status: 'deleted',
        leadsCollection: leadsCollection.filter((lead) => lead._id !== id),
      });
      console.log('leadsCollection after delete', leadsCollection);
    } catch (error) {
      set({ status: 'failed', error: error.message });
    }
  },
});

const useLeadsStore = create()(devtools(persist(leadsStore, { name: 'LeadsStore', partialize: (state) => ({}) })));

export default useLeadsStore;
