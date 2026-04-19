/**
 * 格式化货币数值（不带单位）
 */
export function formatMoney(amount: number): string {
  return amount.toFixed(2);
}

/**
 * 格式化金额（万元）
 */
export function formatAmount(amount: number, unit: 'wan' | 'yi' = 'wan'): string {
  if (unit === 'yi') {
    return `¥${amount.toFixed(2)}亿`;
  }
  if (amount >= 10000) {
    return `¥${(amount / 10000).toFixed(2)}亿`;
  }
  return `¥${amount.toFixed(2)}万`;
}

/**
 * 格式化净值
 */
export function formatNav(nav: number): string {
  return nav.toFixed(4);
}

/**
 * 格式化涨跌幅
 */
export function formatChange(change: number): string {
  const prefix = change >= 0 ? '+' : '';
  return `${prefix}${change.toFixed(2)}%`;
}

/**
 * 格式化日期
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

/**
 * 格式化相对时间
 */
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 7) return `${days}天前`;

  return formatDate(d);
}

/**
 * 隐藏手机号中间四位
 */
export function maskPhone(phone: string): string {
  if (phone.length !== 11) return phone;
  return phone.slice(0, 3) + '****' + phone.slice(7);
}
