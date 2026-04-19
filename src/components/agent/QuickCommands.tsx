'use client';

import { Button } from 'antd';
import { Search, BarChart3, PenLine } from 'lucide-react';

interface QuickCommandsProps {
  onCommand: (command: string) => void;
  disabled: boolean;
}

const commands = [
  { icon: <Search className="w-3 h-3" />, label: '产品查询', command: '帮我查询所有运作中的产品' },
  { icon: <BarChart3 className="w-3 h-3" />, label: '数据统计', command: '告诉我当前的AUM总规模' },
  { icon: <PenLine className="w-3 h-3" />, label: '录入跟进', command: '我想记录一条跟进内容' },
];

export function QuickCommands({ onCommand, disabled }: QuickCommandsProps) {
  return (
    <div className="px-4 py-2 border-t border-warm-100 bg-warm-50 flex items-center gap-2">
      <span className="text-xs text-warm-500">快捷指令:</span>
      {commands.map((cmd) => (
        <Button
          key={cmd.label}
          size="small"
          type="text"
          icon={cmd.icon}
          onClick={() => onCommand(cmd.command)}
          disabled={disabled}
          className="text-xs text-warm-600 hover:text-gold-600 hover:bg-gold-50"
        >
          {cmd.label}
        </Button>
      ))}
    </div>
  );
}
