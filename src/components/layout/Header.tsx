'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from './Logo';
import { ViewSwitcher } from './ViewSwitcher';
import { GlobalSearch } from './GlobalSearch';
import { NotificationCenter } from './NotificationCenter';

const navItems = [
  { href: '/dashboard', label: '数据概览' },
  { href: '/products', label: '产品货架' },
  { href: '/customers', label: '客户管理' },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="h-14 border-b border-warm-200 bg-white fixed top-0 left-0 right-0 z-50">
      <div className="h-full max-w-[1440px] mx-auto px-6 flex items-center justify-between">
        {/* 左侧：Logo + 导航 */}
        <div className="flex items-center gap-10">
          <Link href="/dashboard">
            <Logo />
          </Link>
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    px-4 py-2 rounded-md text-sm font-medium transition-colors
                    ${
                      isActive
                        ? 'text-gold-700 bg-gold-50'
                        : 'text-warm-600 hover:text-warm-900 hover:bg-warm-50'
                    }
                  `}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* 右侧：搜索 + 通知 + 视角切换 */}
        <div className="flex items-center gap-4">
          <GlobalSearch />
          <NotificationCenter />
          <div className="w-px h-6 bg-warm-200"></div>
          <ViewSwitcher />
        </div>
      </div>
    </header>
  );
}
