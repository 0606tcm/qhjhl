'use client';

import { User, Bot } from 'lucide-react';
import type { AgentMessage } from '@/types';
import { formatRelativeTime } from '@/lib/format';
import { AgentResultCard } from './AgentResultCard';

interface MessageItemProps {
  message: AgentMessage;
}

export function MessageItem({ message }: MessageItemProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* 头像 */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser ? 'bg-navy-100 text-navy-700' : 'bg-gold-100 text-gold-600'
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      {/* 消息内容 */}
      <div
        className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} ${
          isUser ? 'max-w-[80%]' : 'max-w-[92%] flex-1'
        }`}
      >
        <div
          className={`px-4 py-2 rounded-lg ${
            isUser
              ? 'bg-navy-700 text-white rounded-br-sm'
              : 'bg-warm-100 text-warm-900 rounded-bl-sm'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        </div>
        {!isUser && message.data && <AgentResultCard data={message.data} />}
        <span className="text-xs text-warm-400 mt-1">
          {formatRelativeTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}
