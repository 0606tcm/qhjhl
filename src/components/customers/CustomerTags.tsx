'use client';

import { useState } from 'react';
import { Tag, Popover, Button, Input, ColorPicker, message, Spin } from 'antd';
import { Plus, X } from 'lucide-react';
import { trpc } from '@/lib/trpc';

interface CustomerTagsProps {
  customerId: string;
  customerTags: Array<{ tag: { id: string; name: string; color: string } }>;
  editable?: boolean;
}

export function CustomerTags({ customerId, customerTags, editable = true }: CustomerTagsProps) {
  const utils = trpc.useUtils();
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#D97706');
  const [showAddPopover, setShowAddPopover] = useState(false);

  const { data: allTags, isLoading: loadingTags } = trpc.tag.list.useQuery();

  const addTagMutation = trpc.tag.addToCustomer.useMutation({
    onSuccess: () => {
      utils.customer.list.invalidate();
      utils.customer.byId.invalidate({ id: customerId });
      message.success('标签添加成功');
    },
  });

  const removeTagMutation = trpc.tag.removeFromCustomer.useMutation({
    onSuccess: () => {
      utils.customer.list.invalidate();
      utils.customer.byId.invalidate({ id: customerId });
      message.success('标签移除成功');
    },
  });

  const createTagMutation = trpc.tag.create.useMutation({
    onSuccess: (newTag) => {
      utils.tag.list.invalidate();
      addTagMutation.mutate({ customerId, tagId: newTag.id });
      setNewTagName('');
      setShowAddPopover(false);
    },
  });

  const handleAddExistingTag = (tagId: string) => {
    addTagMutation.mutate({ customerId, tagId });
    setShowAddPopover(false);
  };

  const handleRemoveTag = (tagId: string) => {
    removeTagMutation.mutate({ customerId, tagId });
  };

  const handleCreateAndAddTag = () => {
    if (!newTagName.trim()) {
      message.warning('请输入标签名称');
      return;
    }
    createTagMutation.mutate({
      name: newTagName.trim(),
      color: newTagColor,
    });
  };

  const currentTagIds = customerTags.map((ct) => ct.tag.id);
  const availableTags = allTags?.filter((tag) => !currentTagIds.includes(tag.id)) || [];

  const addTagContent = (
    <div className="w-64 space-y-3">
      <div className="text-sm font-medium text-warm-700">选择已有标签</div>
      {loadingTags ? (
        <Spin size="small" />
      ) : availableTags.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {availableTags.map((tag) => (
            <Tag
              key={tag.id}
              color={tag.color}
              className="cursor-pointer hover:opacity-80"
              onClick={() => handleAddExistingTag(tag.id)}
            >
              {tag.name}
            </Tag>
          ))}
        </div>
      ) : (
        <div className="text-warm-400 text-xs">暂无可用标签</div>
      )}

      <div className="border-t border-warm-200 pt-3">
        <div className="text-sm font-medium text-warm-700 mb-2">创建新标签</div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="标签名称"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            size="small"
            className="flex-1"
          />
          <ColorPicker
            value={newTagColor}
            onChange={(color) => setNewTagColor(color.toHexString())}
            size="small"
          />
        </div>
        <Button
          type="primary"
          size="small"
          className="w-full mt-2 bg-gold-600 hover:bg-gold-700"
          onClick={handleCreateAndAddTag}
          loading={createTagMutation.isPending}
        >
          创建并添加
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {customerTags.map(({ tag }) => (
        <Tag
          key={tag.id}
          color={tag.color}
          closable={editable}
          onClose={(e) => {
            e.preventDefault();
            handleRemoveTag(tag.id);
          }}
          className="m-0"
        >
          {tag.name}
        </Tag>
      ))}
      {editable && (
        <Popover
          content={addTagContent}
          trigger="click"
          open={showAddPopover}
          onOpenChange={setShowAddPopover}
          placement="bottomLeft"
        >
          <Tag
            className="cursor-pointer border-dashed bg-transparent hover:border-gold-400"
            icon={<Plus className="w-3 h-3" />}
          >
            添加标签
          </Tag>
        </Popover>
      )}
    </div>
  );
}
