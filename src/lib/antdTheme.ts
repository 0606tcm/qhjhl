import type { ThemeConfig } from 'antd';

export const antdTheme: ThemeConfig = {
  token: {
    // 品牌色 - 琥珀金
    colorPrimary: '#D97706',
    colorPrimaryHover: '#B45309',
    colorPrimaryActive: '#92400E',
    colorPrimaryBg: '#FFFBEB',
    colorPrimaryBgHover: '#FEF3C7',

    // 成功色 (涨 - 红色，中国市场习惯)
    colorSuccess: '#DC2626',

    // 错误色 (跌 - 绿色)
    colorError: '#16A34A',

    // 警告色
    colorWarning: '#F59E0B',

    // 链接色
    colorLink: '#1E4976',

    // 中性色 - 暖灰
    colorText: '#1C1917',
    colorTextSecondary: '#57534E',
    colorTextTertiary: '#78716C',
    colorTextQuaternary: '#A8A29E',
    colorBorder: '#D6D3D1',
    colorBorderSecondary: '#E7E5E4',
    colorBgContainer: '#FFFFFF',
    colorBgLayout: '#FAFAF9',

    // 圆角
    borderRadius: 6,
    borderRadiusLG: 8,
    borderRadiusSM: 4,

    // 字体
    fontFamily: '"Inter", "PingFang SC", "Microsoft YaHei", sans-serif',
  },
  components: {
    Table: {
      headerBg: '#F5F5F4',
      headerColor: '#78716C',
      rowHoverBg: '#FFFBEB',
      rowSelectedBg: '#FEF3C7',
      rowSelectedHoverBg: '#FEF3C7',
    },
    Button: {
      primaryShadow: 'none',
    },
    Input: {
      activeBorderColor: '#D97706',
      activeShadow: '0 0 0 3px rgba(217, 119, 6, 0.1)',
    },
    Select: {
      optionSelectedBg: '#FEF3C7',
    },
    Menu: {
      itemSelectedBg: '#FEF3C7',
      itemSelectedColor: '#B45309',
    },
  },
};
