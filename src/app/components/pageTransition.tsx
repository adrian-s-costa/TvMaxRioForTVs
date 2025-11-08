"use client"

import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [isExiting, setIsExiting] = useState(false);
  const [isEntering, setIsEntering] = useState(false);
  const prevPathnameRef = useRef(pathname);

  useEffect(() => {
    // Detecta mudança de rota
    if (prevPathnameRef.current !== pathname) {
      // Fase de saída (fade out + slide)
      setIsExiting(true);
      
      const exitTimer = setTimeout(() => {
        // Atualiza o conteúdo
        setDisplayChildren(children);
        setIsExiting(false);
        
        // Fase de entrada (fade in + slide)
        setIsEntering(true);
        
        const enterTimer = setTimeout(() => {
          setIsEntering(false);
        }, 300);
        
        return () => clearTimeout(enterTimer);
      }, 300);
      
      prevPathnameRef.current = pathname;
      
      return () => clearTimeout(exitTimer);
    } else {
      // Primeira renderização
      setDisplayChildren(children);
    }
  }, [pathname, children]);

  return (
    <div
      className={`transition-all duration-300 ease-in-out ${
        isExiting
          ? 'opacity-0 translate-x-4'
          : isEntering
          ? 'opacity-0 -translate-x-4'
          : 'opacity-100 translate-x-0'
      }`}
      style={{
        willChange: 'opacity, transform',
      }}
    >
      {displayChildren}
    </div>
  );
}

