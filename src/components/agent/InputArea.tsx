'use client';

import { useState, KeyboardEvent } from 'react';
import { Input, Button } from 'antd';
import { Send } from 'lucide-react';

interface InputAreaProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

export function InputArea({ onSend, disabled }: InputAreaProps) {
  const [input, setInput] = useState('');

  const handleSend = () => {
    const trimmed = input.trim();
    if (trimmed) {
      onSend(trimmed);
      setInput('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-warm-200 p-4 bg-white">
      <div className="flex gap-2">
        <Input.TextArea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入您的问题..."
          autoSize={{ minRows: 1, maxRows: 4 }}
          disabled={disabled}
          className="flex-1"
        />
        <Button
          type="primary"
          icon={<Send className="w-4 h-4" />}
          onClick={handleSend}
          disabled={disabled || !input.trim()}
          className="bg-gold-600 hover:bg-gold-700 self-end"
        >
          发送
        </Button>
      </div>
    </div>
  );
}
