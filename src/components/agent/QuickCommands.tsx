'use client';

import { Button } from 'antd';
import { Search, PenLine } from 'lucide-react';

interface QuickCommandsProps {
  onCommand: (command: string) => void;
  disabled: boolean;
}

const commands = [
  {
    icon: <Search className="w-3 h-3" />,
    label: '查客户持仓',
    command: '林总持有哪些基金？',
  },
  {
    icon: <PenLine className="w-3 h-3" />,
    label: '录入跟进',
    command: '今天电话和张总聊了稳健增长一号，他打算下周认购50万',
  },
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
