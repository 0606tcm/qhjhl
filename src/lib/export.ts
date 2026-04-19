import * as XLSX from 'xlsx';

interface ExportColumn {
  key: string;
  title: string;
  formatter?: (value: unknown) => string | number;
}

export function exportToExcel<T extends Record<string, unknown>>(
  data: T[],
  columns: ExportColumn[],
  filename: string
) {
  // 准备数据
  const headers = columns.map((col) => col.title);
  const rows = data.map((item) =>
    columns.map((col) => {
      const value = item[col.key];
      if (col.formatter) {
        return col.formatter(value);
      }
      return value ?? '';
    })
  );

  // 创建工作表
  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);

  // 设置列宽
  const colWidths = columns.map((col) => ({ wch: Math.max(col.title.length * 2, 15) }));
  ws['!cols'] = colWidths;

  // 创建工作簿
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  // 导出文件
  XLSX.writeFile(wb, `${filename}.xlsx`);
}

// 产品导出列配置
export const productExportColumns: ExportColumn[] = [
  { key: 'code', title: '产品代码' },
  { key: 'name', title: '产品名称' },
  {
    key: 'type',
    title: '产品类型',
    formatter: (v) => {
      const map: Record<string, string> = {
        stock: '股票型',
        bond: '债券型',
        hybrid: '混合型',
        money: '货币型',
      };
      return map[v as string] || v as string;
    },
  },
  { key: 'nav', title: '最新净值', formatter: (v) => (v as number).toFixed(4) },
  { key: 'navChange', title: '日涨跌(%)', formatter: (v) => (v as number).toFixed(2) },
  { key: 'aum', title: '规模(亿)', formatter: (v) => (v as number).toFixed(2) },
  {
    key: 'status',
    title: '状态',
    formatter: (v) => {
      const map: Record<string, string> = {
        raising: '募集中',
        active: '运作中',
        liquidated: '已清盘',
      };
      return map[v as string] || v as string;
    },
  },
  { key: 'manager', title: '基金经理' },
];

// 客户导出列配置
export const customerExportColumns: ExportColumn[] = [
  { key: 'name', title: '客户姓名' },
  { key: 'phone', title: '联系电话' },
  {
    key: 'riskPreference',
    title: '风险偏好',
    formatter: (v) => {
      const map: Record<string, string> = {
        conservative: '保守型',
        stable: '稳健型',
        aggressive: '积极型',
      };
      return map[v as string] || v as string;
    },
  },
  { key: 'totalAssets', title: '总持仓(万)', formatter: (v) => (v as number).toFixed(2) },
  { key: 'email', title: '邮箱' },
];
