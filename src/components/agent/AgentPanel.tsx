'use client';

import { Bot, Minus, X, Trash2 } from 'lucide-react';
import { Button, Tooltip } from 'antd';
import { useStore } from '@/store';
import { trpc } from '@/lib/trpc';
import { MessageList } from './MessageList';
import { InputArea } from './InputArea';
import { QuickCommands } from './QuickCommands';
import type { AgentMessage, AgentResponseData } from '@/types';

export function AgentPanel() {
  const {
    agentPanelOpen,
    toggleAgentPanel,
    agentMessages,
    addAgentMessage,
    clearAgentMessages,
    agentLoading,
    setAgentLoading,
  } = useStore();

  const chatMutation = trpc.agent.chat.useMutation({
    onMutate: () => {
      setAgentLoading(true);
    },
    onSuccess: (data) => {
      const assistantMessage: AgentMessage = {
        id: `msg-${Date.now()}-assistant`,
        role: 'assistant',
        content: data.content,
        data: (data as { data?: AgentResponseData }).data,
        timestamp: new Date(),
      };
      addAgentMessage(assistantMessage);
    },
    onError: () => {
      const errorMessage: AgentMessage = {
        id: `msg-${Date.now()}-error`,
        role: 'assistant',
        content: '抱歉，出现了一些问题，请稍后重试。',
        timestamp: new Date(),
      };
      addAgentMessage(errorMessage);
    },
    onSettled: () => {
      setAgentLoading(false);
    },
  });

  const handleSend = (content: string) => {
    // 添加用户消息
    const userMessage: AgentMessage = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content,
      timestamp: new Date(),
    };
    addAgentMessage(userMessage);

    // 发送到后端
    const messages = [...agentMessages, userMessage].map((m) => ({
      role: m.role,
      content: m.content,
    }));
    chatMutation.mutate({ messages });
  };

  if (!agentPanelOpen) {
    // 悬浮按钮
    return (
      <button
        onClick={toggleAgentPanel}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gold-600 text-white shadow-lg hover:bg-gold-700 transition-colors flex items-center justify-center z-50"
      >
        <Bot className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-0 right-0 w-[480px] h-[620px] bg-white shadow-xl border-t-2 border-gold-600 rounded-tl-lg z-50 flex flex-col">
      {/* 头部 */}
      <div className="px-4 py-3 border-b border-warm-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-gold-600" />
          <span className="font-semibold text-warm-900">AI 助手</span>
        </div>
        <div className="flex items-center gap-1">
          <Tooltip title="清空对话">
            <Button
              type="text"
              size="small"
              icon={<Trash2 className="w-4 h-4 text-warm-400" />}
              onClick={clearAgentMessages}
              disabled={agentMessages.length === 0}
            />
          </Tooltip>
          <Tooltip title="最小化">
            <Button
              type="text"
              size="small"
              icon={<Minus className="w-4 h-4 text-warm-400" />}
              onClick={toggleAgentPanel}
            />
          </Tooltip>
        </div>
      </div>

      {/* 消息列表 */}
      <MessageList messages={agentMessages} loading={agentLoading} />

      {/* 快捷指令 */}
      <QuickCommands onCommand={handleSend} disabled={agentLoading} />

      {/* 输入区域 */}
      <InputArea onSend={handleSend} disabled={agentLoading} />
    </div>
  );
}
