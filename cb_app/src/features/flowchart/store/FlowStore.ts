import { create, StateCreator } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { flowBoardSlice } from './flowBoardSlice';
import { flowchartSlice } from './flowchartSlice';
import { IFlowStore } from '../../../types/flowchart';

const flowStore: StateCreator<IFlowStore> = (set, get, api) => ({
  ...flowBoardSlice(set, get, api),
  ...flowchartSlice(set, get, api),
});

const useFlowStore = create<IFlowStore>()(
  devtools(
    persist(flowStore, {
      name: 'FlowStore',
      partialize: () => ({}),
    }),
  ),
);

export default useFlowStore;
