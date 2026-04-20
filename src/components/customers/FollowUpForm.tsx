'use client';

import { useEffect } from 'react';
import { Modal, Form, Input, Select, message, Alert } from 'antd';
import { trpc } from '@/lib/trpc';
import { useStore } from '@/store';

interface FollowUpFormProps {
  open: boolean;
  customerId: string;
  onClose: () => void;
}

const typeOptions = [
  { value: 'call', label: '电话' },
  { value: 'visit', label: '拜访' },
  { value: 'meeting', label: '会议' },
  { value: 'other', label: '其他' },
];

export function FollowUpForm({ open, customerId, onClose }: FollowUpFormProps) {
  const [form] = Form.useForm();
  const { currentUserId, followUpDraft, setFollowUpDraft } = useStore();
  const utils = trpc.useUtils();

  const { data: products } = trpc.product.all.useQuery();

  const draftForThisCustomer =
    followUpDraft && followUpDraft.customerId === customerId ? followUpDraft : null;

  useEffect(() => {
    if (!open) return;
    if (draftForThisCustomer) {
      form.setFieldsValue({
        type: draftForThisCustomer.type,
        content: draftForThisCustomer.content,
        relatedProductIds: draftForThisCustomer.relatedProductIds,
      });
    } else {
      form.resetFields();
    }
  }, [open, draftForThisCustomer, form]);

  const createMutation = trpc.followUp.create.useMutation({
    onSuccess: () => {
      message.success('跟进记录添加成功');
      form.resetFields();
      setFollowUpDraft(null);
      onClose();
      utils.customer.byId.invalidate({ id: customerId });
      utils.customer.followUps.invalidate({ customerId });
      utils.followUp.recent.invalidate();
      utils.followUp.list.invalidate();
      utils.statistics.invalidate();
    },
    onError: (error) => {
      message.error(error.message || '添加失败，请重试');
    },
  });

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      createMutation.mutate({
        ...values,
        customerId,
        salespersonId: currentUserId,
        relatedProductIds: values.relatedProductIds || undefined,
      });
    } catch {
      // validation failed
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setFollowUpDraft(null);
    onClose();
  };

  return (
    <Modal
      title="新增跟进记录"
      open={open}
      onCancel={handleCancel}
      onOk={handleSubmit}
      okText="确认"
      cancelText="取消"
      okButtonProps={{ loading: createMutation.isPending }}
    >
      {draftForThisCustomer && (
        <Alert
          type="info"
          showIcon
          message="已载入 AI 助手解析的草稿"
          description="字段已预填，请确认后提交；如需重填可直接修改。"
          className="mb-3"
        />
      )}
      <Form form={form} layout="vertical" className="mt-2">
        <Form.Item
          name="type"
          label="跟进方式"
          rules={[{ required: true, message: '请选择跟进方式' }]}
        >
          <Select placeholder="请选择跟进方式" options={typeOptions} />
        </Form.Item>
        <Form.Item
          name="content"
          label="跟进内容"
          rules={[{ required: true, message: '请输入跟进内容' }]}
        >
          <Input.TextArea placeholder="请输入跟进内容" rows={4} />
        </Form.Item>
        <Form.Item name="relatedProductIds" label="相关产品">
          <Select
            mode="multiple"
            placeholder="请选择相关产品（可多选）"
            options={products?.map((p) => ({ value: p.id, label: `${p.code} ${p.name}` }))}
            allowClear
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
