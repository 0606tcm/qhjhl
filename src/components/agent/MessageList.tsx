'use client';

import { useEffect, useRef } from 'react';
import { Empty, Spin } from 'antd';
import { Bot } from 'lucide-react';
import { MessageItem } from './MessageItem';
import type { AgentMessage } from '@/types';

interface MessageListProps {
  messages: AgentMessage[];
  loading: boolean;
}

export function MessageList({ messages, loading }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (messages.length === 0 && !loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
        <div className="w-16 h-16 rounded-full bg-gold-100 flex items-center justify-center mb-4">
          <Bot className="w-8 h-8 text-gold-600" />
        </div>
        <h3 className="text-lg font-semibold text-warm-900 mb-2">AI 助手</h3>
        <p className="text-sm text-warm-500 max-w-xs">
          我可以帮你查询产品信息、客户持仓，或者辅助录入跟进记录。试试问我：
        </p>
        <div className="mt-4 space-y-2">
          {[
            '张三持有哪些债券型产品？',
            '稳健增长一号有多少客户持有？',
            '本月跟进了多少次？',
          ].map((example) => (
            <p key={example} className="text-xs text-gold-600 bg-gold-50 px-3 py-1 rounded-full">
              {example}
            </p>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}
      {loading && (
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-gold-100 flex items-center justify-center flex-shrink-0">
            <Bot className="w-4 h-4 text-gold-600" />
          </div>
          <div className="bg-warm-100 rounded-lg rounded-bl-sm px-4 py-2">
            <Spin size="small" />
            <span className="ml-2 text-sm text-warm-500">思考中...</span>
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
