import { StateCreator, StoreApi } from 'zustand';

import { deleteFlowchart, getAllFlowcharts } from '../services/fetchFlowchart';
import { IFlowchartSlice } from '../../../types/flowchart';

const URL: string = import.meta.env.VITE_NODE_BASE_API + '/flowcharts';

export const flowchartSlice: StateCreator<IFlowchartSlice> = (set, get, api) => ({
  status: 'loading',
  error: '',
  flowcharts: [],
  addFlowcharts: async () => {
    set({ status: 'loading', error: '' });
    const data = await getAllFlowcharts();
    if (data.status === 'failed') {
      set({ status: 'failed', error: data.error });
    }
    if (data) {
      set({
        flowcharts: data.data,
        status: data.status,
      });
    }
  },
  deleteFlowchart: async (id) => {
    set({ status: 'loading', error: '' });
    const data = await deleteFlowchart(id);
    if (data.status === 'deleted') {
      set((state) => ({
        ...state,
        status: 'deleted',
        flowcharts: state.flowcharts.filter((flow) => flow._id !== id),
      }));
    } else {
      set({ status: 'failed', error: 'Error deleting flowchart' });
    }
  },
});

export default flowchartSlice;
