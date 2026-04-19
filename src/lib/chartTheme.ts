// ECharts 主题配置
export const chartColors = [
  '#D97706', // 琥珀金 - 股票型
  '#1E4976', // 深海蓝 - 债券型
  '#16A34A', // 翡翠绿 - 混合型
  '#7C3AED', // 皇家紫 - 货币型
  '#0891B2', // 青色
  '#DB2777', // 玫红色
  '#65A30D', // 橄榄绿
  '#EA580C', // 深橙色
];

export const chartTheme = {
  color: chartColors,
  textStyle: {
    fontFamily: 'Inter, PingFang SC, sans-serif',
  },
  title: {
    textStyle: {
      color: '#1C1917',
      fontSize: 16,
      fontWeight: 600,
    },
  },
  legend: {
    textStyle: {
      color: '#57534E',
    },
  },
  tooltip: {
    backgroundColor: '#fff',
    borderColor: '#E7E5E4',
    textStyle: {
      color: '#44403C',
    },
  },
};
