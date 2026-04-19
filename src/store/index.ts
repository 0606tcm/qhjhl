import { create } from 'zustand';
import type { ViewMode, AgentMessage } from '@/types';

interface UIState {
  // 当前视角
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;

  // 当前用户（Mock）
  currentUserId: string;
  currentUserName: string;

  // 侧边栏详情
  drawerOpen: boolean;
  drawerType: 'product' | 'customer' | null;
  drawerEntityId: string | null;
  openDrawer: (type: 'product' | 'customer', entityId: string) => void;
  closeDrawer: () => void;

  // AI Agent 面板
  agentPanelOpen: boolean;
  toggleAgentPanel: () => void;
  agentMessages: AgentMessage[];
  addAgentMessage: (message: AgentMessage) => void;
  clearAgentMessages: () => void;
  agentLoading: boolean;
  setAgentLoading: (loading: boolean) => void;
}

export const useStore = create<UIState>((set) => ({
  // 视角默认为销售
  viewMode: 'sales',
  setViewMode: (mode) => set({ viewMode: mode }),

  // Mock 当前用户
  currentUserId: 'sp001',
  currentUserName: '张明',

  // 侧边栏
  drawerOpen: false,
  drawerType: null,
  drawerEntityId: null,
  openDrawer: (type, entityId) =>
    set({ drawerOpen: true, drawerType: type, drawerEntityId: entityId }),
  closeDrawer: () => set({ drawerOpen: false, drawerType: null, drawerEntityId: null }),

  // Agent 面板
  agentPanelOpen: false,
  toggleAgentPanel: () => set((state) => ({ agentPanelOpen: !state.agentPanelOpen })),
  agentMessages: [],
  addAgentMessage: (message) =>
    set((state) => ({ agentMessages: [...state.agentMessages, message] })),
  clearAgentMessages: () => set({ agentMessages: [] }),
  agentLoading: false,
  setAgentLoading: (loading) => set({ agentLoading: loading }),
}));
