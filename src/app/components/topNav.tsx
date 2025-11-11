"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface TopNavProps {
  isFocused?: boolean;
  focusedMenuItem?: number;
}

export default function TopNav({ isFocused = false, focusedMenuItem = 0 }: TopNavProps) {
  const pathname = usePathname();

  const menuItems = [
    { label: 'Ao Vivo', href: '/home' },
    { label: 'Programas', href: '/programs' }
  ];

  return (
    <>
      {/* Overlay quando menu está aberto */}
      {isFocused && (
        <div className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300" />
      )}
      
      {/* Menu Lateral */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-[#1a1a1a] z-50 transform transition-transform duration-300 ${
        isFocused ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6 h-full flex flex-col">
          {/* Logo */}
          <div className="mb-8">
            <Link href="/home">
              <img 
                src="https://res.cloudinary.com/dmo7nzytn/image/upload/v1755655466/09fa9195634d318711940d331b600d897d2a8187_1_bh67vv.png" 
                width={60} 
                height={110} 
                alt="logo" 
                className='text-white cursor-pointer' 
              />
            </Link>
          </div>
          
          {/* Menu Items */}
          <ul className="space-y-2 flex-1">
            {menuItems.map((item, index) => {
              const isActive = pathname === item.href;
              const isFocusedItem = isFocused && index === focusedMenuItem;
              
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`block px-4 py-3 rounded-lg transition-all duration-200 ${
                      isFocusedItem
                        ? 'bg-[#bc0000] text-white scale-105 shadow-lg'
                        : isActive
                        ? 'bg-[#bc0000]/50 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {item.label}
                      {isActive && (
                        <span className="text-xs">●</span>
                      )}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}

