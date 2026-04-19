import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { TRPCProvider } from '@/lib/TRPCProvider';
import { AntdProvider } from '@/lib/AntdProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'FundOS - 基金销售管理系统',
  description: '帮助渠道销售团队管理基金产品信息和客户关系',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${inter.variable}`}>
      <body>
        <TRPCProvider>
          <AntdProvider>{children}</AntdProvider>
        </TRPCProvider>
      </body>
    </html>
  );
}
