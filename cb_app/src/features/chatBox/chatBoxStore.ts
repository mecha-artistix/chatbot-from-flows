import { create, StateCreator } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

const store: StateCreator<IStore> = (set) => ({
  openChatBox: false,
  chatBoxId: '',
  activeStep: 0,
  testMethod: 'message',
  // setOpenChatBox: (value) => set({ openChatBox: value }),
  setOpenChatBox: (id) => set({ chatBoxId: id, openChatBox: true }),
  setChatBoxId: (id) => set({ chatBoxId: id }),
  closeChatBox: () => set({ openChatBox: false }),
  setActiveStep: (operator) =>
    set((state) => ({ activeStep: operator === '+' ? state.activeStep + 1 : state.activeStep - 1 })),
  handleReset: () => set({ activeStep: 0 }),
  setTestMethod: (method) => set({ testMethod: method }),
});

export const useChatBoxStore = create<IStore>()(
  devtools(
    persist(store, {
      name: 'store',
      partialize: (state) => ({ chatBoxId: state.chatBoxId, openChatBox: state.openChatBox }),
    }),
  ),
);

interface IStore {
  openChatBox: boolean;
  chatBoxId: string;
  activeStep: number;
  testMethod: 'phone' | 'message';
  // setOpenChatBox: (open: boolean) => void;
  setOpenChatBox: (id: string) => void;
  setChatBoxId: (id: string) => void;
  closeChatBox: () => void;
  setActiveStep: (operator: '+' | '-') => void;
  handleReset: () => void;
  setTestMethod: (method: 'phone' | 'message') => void;
}
