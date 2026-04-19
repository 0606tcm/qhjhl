'use client';

import { Modal, Form, Input, Select, message } from 'antd';
import { trpc } from '@/lib/trpc';
import { useStore } from '@/store';

interface CustomerFormProps {
  open: boolean;
  onClose: () => void;
}

const riskOptions = [
  { value: 'conservative', label: '保守型' },
  { value: 'stable', label: '稳健型' },
  { value: 'aggressive', label: '积极型' },
];

export function CustomerForm({ open, onClose }: CustomerFormProps) {
  const [form] = Form.useForm();
  const { currentUserId } = useStore();
  const utils = trpc.useUtils();

  const createMutation = trpc.customer.create.useMutation({
    onSuccess: () => {
      message.success('客户创建成功');
      form.resetFields();
      onClose();
      utils.customer.list.invalidate();
    },
    onError: (error) => {
      message.error(error.message || '创建失败');
    },
  });

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      createMutation.mutate({
        ...values,
        salespersonId: currentUserId,
      });
    } catch {
      // validation failed
    }
  };

  return (
    <Modal
      title="新增客户"
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      okText="确认"
      cancelText="取消"
      okButtonProps={{ loading: createMutation.isPending }}
    >
      <Form form={form} layout="vertical" className="mt-4">
        <Form.Item
          name="name"
          label="客户姓名"
          rules={[{ required: true, message: '请输入客户姓名' }]}
        >
          <Input placeholder="请输入客户姓名" />
        </Form.Item>
        <Form.Item
          name="phone"
          label="联系电话"
          rules={[
            { required: true, message: '请输入联系电话' },
            { pattern: /^1\d{10}$/, message: '请输入正确的手机号' },
          ]}
        >
          <Input placeholder="请输入11位手机号" maxLength={11} />
        </Form.Item>
        <Form.Item name="email" label="电子邮箱" rules={[{ type: 'email', message: '请输入正确的邮箱地址' }]}>
          <Input placeholder="请输入邮箱地址（选填）" />
        </Form.Item>
        <Form.Item
          name="riskPreference"
          label="风险偏好"
          rules={[{ required: true, message: '请选择风险偏好' }]}
        >
          <Select placeholder="请选择风险偏好" options={riskOptions} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
