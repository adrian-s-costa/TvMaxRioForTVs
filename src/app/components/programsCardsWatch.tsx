"use client"

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function VideoCardWatch({ image, title, subtitle, showSrc, programId, seasonEpisodes, currentEpisodeIndex }: {image: string, title: string, subtitle: string, showSrc: string, programId?: string, seasonEpisodes?: any[], currentEpisodeIndex?: number}) {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detecta se está em iOS (incluindo webview)
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    const isIOSDevice = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
    // Também detecta webview
    const isWebView = (window as any).webkit?.messageHandlers || (window as any).ReactNativeWebView;
    setIsIOS(isIOSDevice || isWebView);
    
    // Detecta se é mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleFullscreen = async () => {
    // No mobile, redireciona para a página de episódio
    if (isMobile && programId) {
      const params = new URLSearchParams({
        title: title,
        subtitle: subtitle || '',
        src: showSrc,
        image: image || '',
        programId: programId,
        episodeIndex: currentEpisodeIndex?.toString() || '0'
      });
      
      // Adiciona informações dos episódios da temporada se disponível
      if (seasonEpisodes && seasonEpisodes.length > 0) {
        params.set('episodes', JSON.stringify(seasonEpisodes));
      }
      
      router.push(`/program/${programId}/episode?${params.toString()}`);
      return;
    }

    // No desktop, abre fullscreen normalmente
    const video = videoRef.current;
    if (!video) return;

    // Primeiro, torna o vídeo visível e prepara para fullscreen
    setIsFullscreen(true);
    video.style.display = 'block';
    video.style.position = 'fixed';
    video.style.top = '0';
    video.style.left = '0';
    video.style.width = '100vw';
    video.style.height = '100vh';
    video.style.zIndex = '9999';
    video.style.backgroundColor = 'black';
    document.body.style.overflow = 'hidden';

    // Pequeno delay para garantir que o vídeo está visível antes de tentar fullscreen
    await new Promise(resolve => setTimeout(resolve, 50));

    try {
      // Para iOS/webview, usa webkitEnterFullscreen (método nativo do iOS)
      if (isIOS && (video as any).webkitEnterFullscreen) {
        (video as any).webkitEnterFullscreen();
        return;
      }

      // Para outros navegadores, tenta fullscreen nativo
      if (video.requestFullscreen) {
        await video.requestFullscreen();
      } else if ((video as any).webkitRequestFullscreen) {
        await (video as any).webkitRequestFullscreen();
      } else if ((video as any).mozRequestFullScreen) {
        await (video as any).mozRequestFullScreen();
      } else if ((video as any).msRequestFullscreen) {
        await (video as any).msRequestFullscreen();
      }
      // Se não há API de fullscreen, mantém o fallback CSS que já aplicamos
    } catch (error) {
      console.error('Erro ao entrar em fullscreen nativo:', error);
      // Mantém o fallback CSS que já foi aplicado
    }
  };

  useEffect(() => {
    const onChange = () => {
      const fullscreenElement = 
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement;
      
      const isCurrentlyFullscreen = !!fullscreenElement;
      setIsFullscreen(isCurrentlyFullscreen);
      
      // Se saiu do fullscreen, reseta o estado e restaura scroll
      if (!isCurrentlyFullscreen && videoRef.current) {
        const video = videoRef.current;
        video.style.display = '';
        video.style.position = '';
        video.style.top = '';
        video.style.left = '';
        video.style.width = '';
        video.style.height = '';
        video.style.zIndex = '';
        video.style.backgroundColor = '';
        // Restaura scroll
        document.body.style.overflow = '';
      } else if (isCurrentlyFullscreen) {
        // Bloqueia scroll quando entra em fullscreen
        document.body.style.overflow = 'hidden';
      }
    };

    document.addEventListener("fullscreenchange", onChange);
    document.addEventListener("webkitfullscreenchange", onChange);
    document.addEventListener("mozfullscreenchange", onChange);
    document.addEventListener("MSFullscreenChange", onChange);

    // Para iOS, também ouve eventos de pause/play que podem indicar saída do fullscreen
    const video = videoRef.current;
    if (video && isIOS) {
      const handlePause = () => {
        // Pequeno delay para verificar se realmente saiu do fullscreen
        setTimeout(() => {
          if (videoRef.current && !document.fullscreenElement && !(document as any).webkitFullscreenElement) {
            setIsFullscreen(false);
          }
        }, 100);
      };
      
      video.addEventListener('pause', handlePause);
      
      return () => {
        document.removeEventListener("fullscreenchange", onChange);
        document.removeEventListener("webkitfullscreenchange", onChange);
        document.removeEventListener("mozfullscreenchange", onChange);
        document.removeEventListener("MSFullscreenChange", onChange);
        video.removeEventListener('pause', handlePause);
      };
    }

    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      document.removeEventListener("webkitfullscreenchange", onChange);
      document.removeEventListener("mozfullscreenchange", onChange);
      document.removeEventListener("MSFullscreenChange", onChange);
    };
  }, [isIOS]);

  useEffect(() => {
    if (!isFullscreen && videoRef.current) {
      const video = videoRef.current;
      video.pause();
      // Limpa estilos e restaura scroll quando não está em fullscreen
      video.style.display = '';
      video.style.position = '';
      video.style.top = '';
      video.style.left = '';
      video.style.width = '';
      video.style.height = '';
      video.style.zIndex = '';
      video.style.backgroundColor = '';
      document.body.style.overflow = '';
    } else if (isFullscreen) {
      // Bloqueia scroll quando está em fullscreen
      document.body.style.overflow = 'hidden';
    }
  }, [isFullscreen]);

  useEffect(() => {
    // Configura atributos específicos para iOS/webview
    if (videoRef.current) {
      const video = videoRef.current;
      video.setAttribute('playsinline', 'false');
      video.setAttribute('webkit-playsinline', 'false');
      video.setAttribute('x5-playsinline', 'false');
      video.setAttribute('x5-video-player-type', 'h5');
      video.setAttribute('x5-video-player-fullscreen', 'true');
      video.setAttribute('x5-video-orientation', 'portrait');
    }
  }, []);

  return (
    <>
      <video
        ref={videoRef}
        controls
        src={showSrc}
        className={isFullscreen ? `fixed inset-0 z-[9999] bg-black` : `hidden`}
        playsInline={false}
        style={isFullscreen ? {
          display: 'block',
          position: 'fixed',
          top: '0',
          left: '0',
          width: '100vw',
          height: '100vh',
          objectFit: 'contain',
          zIndex: 9999,
          backgroundColor: 'black',
        } : {}}
        onEnded={() => {
          if (videoRef.current) {
            const video = videoRef.current;
            video.style.display = '';
            video.style.position = '';
            video.style.top = '';
            video.style.left = '';
            video.style.width = '';
            video.style.height = '';
            video.style.zIndex = '';
            video.style.backgroundColor = '';
            document.body.style.overflow = '';
            setIsFullscreen(false);
          }
        }}
      />
      <div
        onClick={handleFullscreen}
        className="relative w-[206px] h-[106px] md:w-[343px] md:h-[244px] rounded-xl overflow-hidden border border-white/20 bg-zinc-800 flex-shrink-0 cursor-pointer">
        {/* Imagem */}
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
          />

        {/* Overlay gradient + sombra (sempre visível) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Ícone play (sempre visível) */}
        <div className="absolute inset-0 flex items-center justify-center">
          <img src="https://res.cloudinary.com/dmo7nzytn/image/upload/v1755795839/play_xnfbn8.svg" alt="" />
        </div>

        {/* Texto embaixo (sempre visível) */}
        <div className="absolute bottom-3 left-3 text-white">
          <h3 className="text-sm font-semibold">{title}</h3>
          <p className="text-xs opacity-80">{subtitle}</p>
        </div>
      </div>
    </>
  );
}
