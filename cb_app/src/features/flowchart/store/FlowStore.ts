import { create, StoreApi } from 'zustand';
import { devtools, persist, StateCreator } from 'zustand/middleware';
import { nodeSlice } from './nodeSlice';
import { flowBoardSlice } from './flowBoardSlice';
import { flowchartSlice } from './flowchartSlice';
import { IFlowStore } from '../../../types/flowchart';

const flowStore: StateCreator<IFlowStore> = (set, get, api) => ({
  ...nodeSlice(set, get, api),
  ...flowBoardSlice(set, get, api),
  ...flowchartSlice(set, get, api),
});

const useFlowStore = create<IFlowStore>()(
  devtools(
    persist(flowStore, {
      name: 'FlowStore',
      partialize: (state) => ({
        clickedNode: state.clickedNode,
      }),
    }),
  ),
);

export default useFlowStore;
