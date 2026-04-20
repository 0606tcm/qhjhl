import { create } from 'zustand';
import type { ViewMode, AgentMessage, FollowUpType } from '@/types';

export interface FollowUpDraft {
  customerId: string;
  type?: FollowUpType;
  content?: string;
  relatedProductIds?: string[];
}

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
  openAgentPanel: () => void;
  agentMessages: AgentMessage[];
  addAgentMessage: (message: AgentMessage) => void;
  clearAgentMessages: () => void;
  agentLoading: boolean;
  setAgentLoading: (loading: boolean) => void;

  // 跟进草稿（由 Agent 辅助录入填充）
  followUpDraft: FollowUpDraft | null;
  setFollowUpDraft: (draft: FollowUpDraft | null) => void;
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
  openAgentPanel: () => set({ agentPanelOpen: true }),
  agentMessages: [],
  addAgentMessage: (message) =>
    set((state) => ({ agentMessages: [...state.agentMessages, message] })),
  clearAgentMessages: () => set({ agentMessages: [] }),
  agentLoading: false,
  setAgentLoading: (loading) => set({ agentLoading: loading }),

  // 跟进草稿
  followUpDraft: null,
  setFollowUpDraft: (draft) => set({ followUpDraft: draft }),
}));
