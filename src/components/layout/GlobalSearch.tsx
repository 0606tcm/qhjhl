'use client';

import { useState, useRef, useEffect } from 'react';
import { Input, Modal, Empty, Spin } from 'antd';
import { Search, Briefcase, User, X } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { useStore } from '@/store';
import { ProductTypeTag, RiskPreferenceTag } from '@/components/common';
import { formatAmount } from '@/lib/format';
import type { ProductType, RiskPreference } from '@/types';

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { openDrawer } = useStore();

  // 搜索产品
  const { data: products, isLoading: loadingProducts } = trpc.product.list.useQuery(
    { keyword, page: 1, pageSize: 5 },
    { enabled: open && keyword.length >= 1 }
  );

  // 搜索客户
  const { data: customers, isLoading: loadingCustomers } = trpc.customer.list.useQuery(
    { keyword, page: 1, pageSize: 5 },
    { enabled: open && keyword.length >= 1 }
  );

  const isLoading = loadingProducts || loadingCustomers;
  const hasResults =
    (products?.data && products.data.length > 0) ||
    (customers?.data && customers.data.length > 0);

  // 快捷键 Cmd/Ctrl + K 打开搜索
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 打开时聚焦输入框
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setKeyword('');
    }
  }, [open]);

  const handleSelect = (type: 'product' | 'customer', id: string) => {
    setOpen(false);
    openDrawer(type, id);
  };

  return (
    <>
      {/* 搜索触发按钮 */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-warm-500 bg-warm-100 rounded-md hover:bg-warm-200 transition-colors"
      >
        <Search className="w-4 h-4" />
        <span>搜索...</span>
        <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-xs text-warm-400 bg-white rounded border border-warm-200">
          <span>⌘</span>K
        </kbd>
      </button>

      {/* 搜索弹窗 */}
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        closable={false}
        width={600}
        className="global-search-modal"
        style={{ top: 100 }}
      >
        <div className="p-4">
          {/* 搜索输入框 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-400" />
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="搜索产品或客户..."
              className="w-full pl-10 pr-10 py-3 text-lg border border-warm-200 rounded-lg focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-100"
            />
            {keyword && (
              <button
                onClick={() => setKeyword('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-400 hover:text-warm-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* 搜索结果 */}
          <div className="mt-4 max-h-[400px] overflow-y-auto">
            {!keyword && (
              <div className="text-center py-8 text-warm-400">
                输入关键词搜索产品或客户
              </div>
            )}

            {keyword && isLoading && (
              <div className="flex items-center justify-center py-8">
                <Spin />
              </div>
            )}

            {keyword && !isLoading && !hasResults && (
              <Empty description="未找到相关结果" />
            )}

            {keyword && !isLoading && hasResults && (
              <div className="space-y-4">
                {/* 产品结果 */}
                {products?.data && products.data.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 text-sm text-warm-500 mb-2">
                      <Briefcase className="w-4 h-4" />
                      <span>产品 ({products.total})</span>
                    </div>
                    <div className="space-y-1">
                      {products.data.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => handleSelect('product', product.id)}
                          className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gold-50 transition-colors text-left"
                        >
                          <div>
                            <span className="font-medium text-warm-900">
                              {product.name}
                            </span>
                            <span className="ml-2 text-sm text-warm-500">
                              {product.code}
                            </span>
                          </div>
                          <ProductTypeTag type={product.type as ProductType} />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 客户结果 */}
                {customers?.data && customers.data.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 text-sm text-warm-500 mb-2">
                      <User className="w-4 h-4" />
                      <span>客户 ({customers.total})</span>
                    </div>
                    <div className="space-y-1">
                      {customers.data.map((customer) => (
                        <button
                          key={customer.id}
                          onClick={() => handleSelect('customer', customer.id)}
                          className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gold-50 transition-colors text-left"
                        >
                          <div>
                            <span className="font-medium text-warm-900">
                              {customer.name}
                            </span>
                            <span className="ml-2 text-sm text-warm-500">
                              {formatAmount(customer.totalAssets)}
                            </span>
                          </div>
                          <RiskPreferenceTag
                            preference={customer.riskPreference as RiskPreference}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 底部提示 */}
          <div className="mt-4 pt-3 border-t border-warm-100 flex items-center justify-between text-xs text-warm-400">
            <div className="flex items-center gap-4">
              <span>
                <kbd className="px-1.5 py-0.5 bg-warm-100 rounded">↑↓</kbd> 导航
              </span>
              <span>
                <kbd className="px-1.5 py-0.5 bg-warm-100 rounded">Enter</kbd> 选择
              </span>
            </div>
            <span>
              <kbd className="px-1.5 py-0.5 bg-warm-100 rounded">Esc</kbd> 关闭
            </span>
          </div>
        </div>
      </Modal>
    </>
  );
}
