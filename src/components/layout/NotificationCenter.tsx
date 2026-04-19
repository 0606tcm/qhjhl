'use client';

import { useState } from 'react';
import { Popover, Badge, Empty, Button } from 'antd';
import { Bell, Phone, Calendar, AlertCircle, Check } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { useStore } from '@/store';
import { formatRelativeTime } from '@/lib/format';

interface Notification {
  id: string;
  type: 'follow_up_reminder' | 'new_customer' | 'product_update';
  title: string;
  description: string;
  time: Date;
  read: boolean;
  customerId?: string;
  productId?: string;
}

export function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const { openDrawer, currentUserId } = useStore();

  // 获取最近的跟进记录来生成提醒
  const { data: recentFollowUps } = trpc.followUp.recent.useQuery({
    salespersonId: currentUserId,
    limit: 5,
  });

  // 生成模拟通知（实际项目中应该从后端获取）
  const notifications: Notification[] = [
    {
      id: '1',
      type: 'follow_up_reminder',
      title: '跟进提醒',
      description: '客户 张三 已超过7天未跟进，建议尽快联系',
      time: new Date(Date.now() - 1000 * 60 * 30),
      read: false,
      customerId: 'c001',
    },
    {
      id: '2',
      type: 'follow_up_reminder',
      title: '跟进提醒',
      description: '客户 李四 的稳健增长一号即将到期',
      time: new Date(Date.now() - 1000 * 60 * 60 * 2),
      read: false,
      customerId: 'c002',
    },
    {
      id: '3',
      type: 'product_update',
      title: '产品更新',
      description: '新产品「科技先锋三号」已上架，募集中',
      time: new Date(Date.now() - 1000 * 60 * 60 * 24),
      read: true,
      productId: 'p001',
    },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNotificationClick = (notification: Notification) => {
    if (notification.customerId) {
      openDrawer('customer', notification.customerId);
    } else if (notification.productId) {
      openDrawer('product', notification.productId);
    }
    setOpen(false);
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'follow_up_reminder':
        return <Phone className="w-4 h-4 text-gold-600" />;
      case 'new_customer':
        return <Calendar className="w-4 h-4 text-green-600" />;
      case 'product_update':
        return <AlertCircle className="w-4 h-4 text-blue-600" />;
    }
  };

  const content = (
    <div className="w-80">
      <div className="flex items-center justify-between px-4 py-3 border-b border-warm-100">
        <span className="font-semibold text-warm-900">通知中心</span>
        {unreadCount > 0 && (
          <Button type="link" size="small" className="text-gold-600">
            全部已读
          </Button>
        )}
      </div>

      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="py-8">
            <Empty description="暂无通知" />
          </div>
        ) : (
          <div>
            {notifications.map((notification) => (
              <button
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`w-full flex gap-3 p-4 hover:bg-warm-50 transition-colors text-left border-b border-warm-50 last:border-b-0 ${
                  !notification.read ? 'bg-gold-50/50' : ''
                }`}
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-warm-100 flex items-center justify-center">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-warm-900 text-sm">
                      {notification.title}
                    </span>
                    {!notification.read && (
                      <span className="w-2 h-2 rounded-full bg-gold-500"></span>
                    )}
                  </div>
                  <p className="text-sm text-warm-600 mt-0.5 line-clamp-2">
                    {notification.description}
                  </p>
                  <span className="text-xs text-warm-400 mt-1 block">
                    {formatRelativeTime(notification.time)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="px-4 py-3 border-t border-warm-100">
        <Button type="link" block className="text-warm-500">
          查看全部通知
        </Button>
      </div>
    </div>
  );

  return (
    <Popover
      content={content}
      trigger="click"
      open={open}
      onOpenChange={setOpen}
      placement="bottomRight"
      arrow={false}
    >
      <button className="relative p-2 text-warm-500 hover:text-warm-700 hover:bg-warm-100 rounded-md transition-colors">
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>
    </Popover>
  );
}
