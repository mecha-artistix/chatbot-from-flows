import { StateCreator } from 'zustand';

import { deleteFlowchart } from '../services/fetchFlowchart';
import { IFlowchartSlice } from '../../../types/flowchart';

export const flowchartSlice: StateCreator<IFlowchartSlice> = (set, get, api) => ({
  error: '',
  flowcharts: [],
  addFlowcharts: (flowcharts) => set({ flowcharts }),

  deleteFlowchart: async (id) => {
    const data = await deleteFlowchart(id);
    if (data.status === 'deleted') {
      set((state) => ({
        ...state,
        flowcharts: state.flowcharts.filter((flow) => flow._id !== id),
      }));
    } else {
      set({ status: 'failed', error: 'Error deleting flowchart' });
    }
  },
});

export default flowchartSlice;
