'use client';

import { Timeline, Empty, Button } from 'antd';
import { Phone, MapPin, Users, MoreHorizontal, Plus } from 'lucide-react';
import { formatRelativeTime } from '@/lib/format';
import { FollowUpTypeTag } from '@/components/common';
import type { FollowUpType } from '@/types';

interface FollowUpRecord {
  id: string;
  type: string;
  content: string;
  createdAt: string | Date;
  salesperson?: {
    id: string;
    name: string;
  };
}

interface FollowUpTimelineProps {
  followUps: FollowUpRecord[];
  onAddFollowUp: () => void;
}

const typeIcons: Record<string, React.ReactNode> = {
  call: <Phone className="w-4 h-4" />,
  visit: <MapPin className="w-4 h-4" />,
  meeting: <Users className="w-4 h-4" />,
  other: <MoreHorizontal className="w-4 h-4" />,
};

export function FollowUpTimeline({ followUps, onAddFollowUp }: FollowUpTimelineProps) {
  if (followUps.length === 0) {
    return (
      <div className="text-center py-8">
        <Empty description="暂无跟进记录" />
        <Button
          type="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={onAddFollowUp}
          className="mt-4 bg-gold-600 hover:bg-gold-700"
        >
          添加跟进记录
        </Button>
      </div>
    );
  }

  const items = followUps.map((item) => ({
    dot: (
      <div className="w-8 h-8 rounded-full bg-gold-100 flex items-center justify-center text-gold-600">
        {typeIcons[item.type] || typeIcons.other}
      </div>
    ),
    children: (
      <div className="pb-4">
        <div className="flex items-center gap-2 mb-1">
          <FollowUpTypeTag type={item.type as FollowUpType} />
          <span className="text-xs text-warm-400">{formatRelativeTime(item.createdAt)}</span>
          {item.salesperson && (
            <span className="text-xs text-warm-500">- {item.salesperson.name}</span>
          )}
        </div>
        <p className="text-sm text-warm-700 leading-relaxed">{item.content}</p>
      </div>
    ),
  }));

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-warm-500">最近 {followUps.length} 条记录</span>
        <Button
          type="link"
          size="small"
          icon={<Plus className="w-3 h-3" />}
          onClick={onAddFollowUp}
          className="text-gold-600"
        >
          新增跟进
        </Button>
      </div>
      <Timeline items={items} />
    </div>
  );
}
