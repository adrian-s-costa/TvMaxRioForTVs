"use client"

import { useEffect, useState } from 'react';

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [logoScale, setLogoScale] = useState(0.3);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Verifica se já foi mostrado (usando localStorage)
    // Para testar, limpe o localStorage: localStorage.removeItem('hasSeenSplash')
    if (typeof window === 'undefined') return;
    
    const hasSeenSplash = localStorage.getItem('hasSeenSplash');
    
    if (hasSeenSplash === 'true') {
      setIsVisible(false);
      return;
    }

    // Mostra a tela de loading
    setIsVisible(true);
    
    // Marca como visto imediatamente para evitar múltiplas execuções
    localStorage.setItem('hasSeenSplash', 'true');

    // Sequência de animação similar ao Pluto TV
    // Fase 1: Logo aparece com scale up
    const timer1 = setTimeout(() => {
      setShowLogo(true);
      // Animação de scale up suave
      let scale = 0.3;
      const scaleInterval = setInterval(() => {
        scale += 0.05;
        if (scale >= 1.1) {
          scale = 1.0; // Volta para tamanho normal após overshoot
          clearInterval(scaleInterval);
        }
        setLogoScale(scale);
      }, 16); // ~60fps
    }, 300); // Logo aparece após 300ms

    // Fase 2: Logo estabiliza
    const timer2 = setTimeout(() => {
      setLogoScale(1.0);
    }, 1800);

    // Fase 3: Fade out
    const timer3 = setTimeout(() => {
      setIsFadingOut(true);
    }, 2200); // Começa fade out após 2.2s

    // Fase 4: Remove completamente
    const timer4 = setTimeout(() => {
      setIsVisible(false);
    }, 3000); // Remove completamente após 3s

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  // Não renderiza até estar montado (evita problemas de hidratação)
  if (!mounted || !isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] bg-gradient-to-br from-[#141414] via-[#1a1a1a] to-[#141414] flex items-center justify-center transition-opacity duration-800 ease-in-out ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        pointerEvents: isFadingOut ? 'none' : 'auto',
        userSelect: 'none',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh'
      }}
    >
      <div className="relative flex items-center justify-center">
        {/* Logo com animação de entrada estilo Pluto TV */}
        <div
          className={`transition-all duration-1000 ease-out ${
            showLogo
              ? 'opacity-100'
              : 'opacity-0'
          }`}
          style={{
            transform: `scale(${logoScale})`,
            transition: 'transform 0.1s ease-out'
          }}
        >
          <img
            src="https://res.cloudinary.com/dmo7nzytn/image/upload/v1755655466/09fa9195634d318711940d331b600d897d2a8187_1_bh67vv.png"
            alt="TV MAX Rio Logo"
            className="w-40 md:w-64 h-auto relative z-10"
            style={{
              filter: 'drop-shadow(0 0 30px rgba(188, 0, 0, 0.6)) drop-shadow(0 0 60px rgba(188, 0, 0, 0.3))',
              animation: showLogo && !isFadingOut ? 'logoGlow 2s ease-in-out infinite' : 'none'
            }}
          />
        </div>

        {/* Efeitos de brilho/pulse animados estilo Pluto TV */}
        {showLogo && !isFadingOut && (
          <>
            {/* Círculo externo - ping */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div 
                className="w-48 md:w-80 h-48 md:h-80 rounded-full bg-[#bc0000]/20 animate-ping" 
                style={{ 
                  animationDuration: '2.5s',
                  animationIterationCount: 'infinite'
                }} 
              />
            </div>
            
            {/* Círculo médio - pulse */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div 
                className="w-40 md:w-64 h-40 md:h-64 rounded-full bg-[#bc0000]/15 animate-pulse" 
                style={{ 
                  animationDuration: '2s',
                  animationIterationCount: 'infinite'
                }} 
              />
            </div>

            {/* Círculo interno - glow suave */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div 
                className="w-32 md:w-48 h-32 md:h-48 rounded-full bg-[#bc0000]/10"
                style={{
                  animation: 'glowPulse 1.5s ease-in-out infinite',
                  boxShadow: '0 0 40px rgba(188, 0, 0, 0.3)'
                }}
              />
            </div>
          </>
        )}
      </div>

      {/* Estilos CSS para animações customizadas */}
      <style jsx>{`
        @keyframes logoGlow {
          0%, 100% {
            filter: drop-shadow(0 0 30px rgba(188, 0, 0, 0.6)) drop-shadow(0 0 60px rgba(188, 0, 0, 0.3));
          }
          50% {
            filter: drop-shadow(0 0 40px rgba(188, 0, 0, 0.8)) drop-shadow(0 0 80px rgba(188, 0, 0, 0.5));
          }
        }

        @keyframes glowPulse {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  );
}

