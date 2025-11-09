"use client"

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface MenuItem {
  label: string;
  href: string;
}

interface SideMenuProps {
  isOpen: boolean;
  isFocused: boolean;
  focusedMenuItem: number;
  menuItems: MenuItem[];
  onClose: () => void;
}

export default function SideMenu({ 
  isOpen, 
  isFocused, 
  focusedMenuItem,
  menuItems,
  onClose 
}: SideMenuProps) {
  const pathname = usePathname();
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Menu Lateral */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-[#1a1a1a] z-50 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-white">Menu</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-[#bc0000] transition-colors text-2xl"
            >
              ×
            </button>
          </div>
          
          <ul className="space-y-2">
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

