"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Film } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function BottomNav() {
  const pathname = usePathname();
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const checkFullscreen = () => {
      const fullscreenElement = 
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement;
      
      setIsFullscreen(!!fullscreenElement);
    };

    document.addEventListener("fullscreenchange", checkFullscreen);
    document.addEventListener("webkitfullscreenchange", checkFullscreen);
    document.addEventListener("mozfullscreenchange", checkFullscreen);
    document.addEventListener("MSFullscreenChange", checkFullscreen);

    return () => {
      document.removeEventListener("fullscreenchange", checkFullscreen);
      document.removeEventListener("webkitfullscreenchange", checkFullscreen);
      document.removeEventListener("mozfullscreenchange", checkFullscreen);
      document.removeEventListener("MSFullscreenChange", checkFullscreen);
    };
  }, []);

  return (
    <nav className={`fixed bottom-0 left-0 right-0 bg-[#1a1a1a] border-t border-gray-800 z-50 md:hidden transition-transform duration-300 ${
      isFullscreen ? 'translate-y-full' : 'translate-y-0'
    }`}>
      <div className="flex justify-around items-center h-16 px-2">
        <Link
          href="/home"
          className={`relative flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-lg transition-all duration-300 ease-in-out ${
            pathname === '/home'
              ? 'text-[#bc0000] scale-110'
              : 'text-gray-400 hover:text-white hover:scale-105'
          }`}
        >
          <div className={`transition-transform duration-300 ${pathname === '/home' ? 'scale-110' : ''}`}>
            <Home size={22} />
          </div>
          <span className={`text-xs font-medium transition-all duration-300 ${
            pathname === '/home' ? 'font-bold' : 'font-medium'
          }`}>
            Home
          </span>
          {pathname === '/home' && (
            <span className="absolute top-0 left-1/2 transform -translate-x-1/2 w-10 h-0.5 bg-[#bc0000] rounded-full animate-pulse"></span>
          )}
        </Link>

        <Link
          href="/programs"
          className={`relative flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-lg transition-all duration-300 ease-in-out ${
            pathname === '/programs'
              ? 'text-[#bc0000] scale-110'
              : 'text-gray-400 hover:text-white hover:scale-105'
          }`}
        >
          <div className={`transition-transform duration-300 ${pathname === '/programs' ? 'scale-110' : ''}`}>
            <Film size={22} />
          </div>
          <span className={`text-xs font-medium transition-all duration-300 ${
            pathname === '/programs' ? 'font-bold' : 'font-medium'
          }`}>
            Programas
          </span>
          {pathname === '/programs' && (
            <span className="absolute top-0 left-1/2 transform -translate-x-1/2 w-10 h-0.5 bg-[#bc0000] rounded-full animate-pulse"></span>
          )}
        </Link>
        
        <Link
          href="/social"
          className={`relative flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-lg transition-all duration-300 ease-in-out ${
            pathname === '/social'
              ? 'text-[#bc0000] scale-110'
              : 'text-gray-400 hover:text-white hover:scale-105'
          }`}
        >
          <div className={`transition-transform duration-300 ${pathname === '/social' ? 'scale-110' : ''}`}>
            <Users size={22} />
          </div>
          <span className={`text-xs font-medium transition-all duration-300 ${
            pathname === '/social' ? 'font-bold' : 'font-medium'
          }`}>
            Social
          </span>
          {pathname === '/social' && (
            <span className="absolute top-0 left-1/2 transform -translate-x-1/2 w-10 h-0.5 bg-[#bc0000] rounded-full animate-pulse"></span>
          )}
        </Link>
      </div>
    </nav>
  );
}

