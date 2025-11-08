"use client"

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Play } from 'lucide-react';
import TopNav from '../../../components/topNav';

interface Episode {
  name: string;
  description: string;
  source: string;
  thumbnailSrc: string;
}

export default function EpisodePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);

  // Pega os dados do episódio da URL
  const title = searchParams.get('title') || '';
  const subtitle = searchParams.get('subtitle') || '';
  const showSrc = searchParams.get('src') || '';
  const image = searchParams.get('image') || '';
  const programId = searchParams.get('programId') || '';
  const episodeIndex = parseInt(searchParams.get('episodeIndex') || '0');
  const episodesParam = searchParams.get('episodes');

  useEffect(() => {
    // Detecta se está em iOS (incluindo webview)
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    const isIOSDevice = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
    const isWebView = (window as any).webkit?.messageHandlers || (window as any).ReactNativeWebView;
    setIsIOS(isIOSDevice || isWebView);

    // Carrega lista de episódios
    if (episodesParam) {
      try {
        const parsedEpisodes = JSON.parse(episodesParam);
        setEpisodes(parsedEpisodes);
        setCurrentEpisodeIndex(episodeIndex);
      } catch (error) {
        console.error('Erro ao parsear episódios:', error);
      }
    }
  }, [episodesParam, episodeIndex]);

  const handleFullscreen = async () => {
    const video = videoRef.current;
    if (!video) return;

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
    } catch (error) {
      console.error('Erro ao entrar em fullscreen:', error);
    }
  };

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

  const handleEpisodeClick = (episode: Episode, index: number) => {
    const params = new URLSearchParams({
      title: episode.name,
      subtitle: episode.description || '',
      src: episode.source,
      image: episode.thumbnailSrc || '',
      programId: programId,
      episodeIndex: index.toString(),
      episodes: JSON.stringify(episodes)
    });
    router.push(`/program/${programId}/episode?${params.toString()}`);
  };

  const currentEpisode = episodes[currentEpisodeIndex] || { name: title, description: subtitle, source: showSrc, thumbnailSrc: image };

  return (
    <div className="min-h-screen bg-[#141414] text-white font-[Poppins] pb-24">
      <TopNav />
      
      {/* Botão voltar */}
      <button
        onClick={() => router.back()}
        className="fixed top-20 left-4 z-50 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors md:hidden"
        aria-label="Voltar"
      >
        <ArrowLeft size={24} className="text-white" />
      </button>

      {/* Player - 100% width no mobile */}
      <div className="w-full bg-black md:pt-20">
        <video
          ref={videoRef}
          controls
          src={currentEpisode.source || showSrc}
          className="w-full h-auto md:max-h-[70vh] object-contain"
          playsInline={false}
          poster={currentEpisode.thumbnailSrc || image}
          onDoubleClick={handleFullscreen}
        />
      </div>

      <div className="px-0 md:px-8">
        {/* Informações do episódio */}
        <div className="px-4 md:px-0 mt-4 mb-4">
          <h1 className="text-xl md:text-3xl font-bold mb-2 text-white">{currentEpisode.name || title}</h1>
          {currentEpisode.description && (
            <p className="text-sm md:text-base text-gray-300 leading-relaxed line-clamp-2">{currentEpisode.description}</p>
          )}
        </div>

        {/* Lista de episódios */}
        {episodes.length > 0 && (
          <div className="px-4 md:px-0">
            <h2 className="text-lg md:text-xl font-semibold mb-4 text-white">Episódios</h2>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 md:mx-0 md:px-0 md:flex-col md:max-h-[60vh] md:overflow-y-auto">
              {episodes.map((episode, index) => (
                <button
                  key={index}
                  onClick={() => handleEpisodeClick(episode, index)}
                  className={`flex-shrink-0 flex items-center gap-3 p-3 rounded-lg transition-all md:w-full ${
                    index === currentEpisodeIndex
                      ? 'bg-[#bc0000] text-white'
                      : 'bg-[#1a1a1a] hover:bg-[#252525] text-white'
                  }`}
                >
                  <div className="relative w-24 h-14 md:w-32 md:h-20 rounded overflow-hidden flex-shrink-0">
                    {episode.thumbnailSrc ? (
                      <img
                        src={episode.thumbnailSrc}
                        alt={episode.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                        <Play size={20} className="text-gray-400" />
                      </div>
                    )}
                    {index === currentEpisodeIndex && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Play size={24} className="text-white" fill="white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm md:text-base font-medium truncate">Episódio {index + 1}</p>
                    <p className="text-xs md:text-sm text-gray-300 truncate">{episode.name}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

