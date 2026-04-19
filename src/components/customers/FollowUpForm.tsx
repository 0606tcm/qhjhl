'use client';

import { Modal, Form, Input, Select, message } from 'antd';
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
  const { currentUserId } = useStore();
  const utils = trpc.useUtils();

  const { data: products } = trpc.product.all.useQuery();

  const createMutation = trpc.followUp.create.useMutation({
    onSuccess: () => {
      message.success('跟进记录添加成功');
      form.resetFields();
      onClose();
      utils.customer.byId.invalidate({ id: customerId });
      utils.customer.followUps.invalidate({ customerId });
      utils.statistics.invalidate();
    },
    onError: (error) => {
      message.error(error.message || '添加失败');
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

  return (
    <Modal
      title="新增跟进记录"
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      okText="确认"
      cancelText="取消"
      okButtonProps={{ loading: createMutation.isPending }}
    >
      <Form form={form} layout="vertical" className="mt-4">
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
