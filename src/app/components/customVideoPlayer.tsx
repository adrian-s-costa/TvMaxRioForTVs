"use client"

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, SkipBack, SkipForward, ArrowLeft } from 'lucide-react';

interface CustomVideoPlayerProps {
  src: string;
  title?: string;
  subtitle?: string;
  programId?: string;
  onClose?: () => void;
  skipSeconds?: number;
}

export default function CustomVideoPlayer({
  src,
  title,
  subtitle,
  programId,
  onClose,
  skipSeconds = 10
}: CustomVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null);
  const [hasEnteredFullscreen, setHasEnteredFullscreen] = useState(false);

  // Atualiza o tempo atual do vídeo
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  // Controles de teclado
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const video = videoRef.current;
    if (!video) return;

    // Mostra controles quando qualquer tecla é pressionada
    setShowControls(true);
    if (controlsTimeout) {
      clearTimeout(controlsTimeout);
    }

    // Detecta teclas de mídia (alguns controles remotos usam code ao invés de key)
    const isMediaKey = e.key === 'MediaPlayPause' || 
                       e.key === 'PlayPause' ||
                       e.code === 'MediaPlayPause' ||
                       e.code === 'PlayPause';

    switch (e.key) {
      case 'Enter':
      case ' ': // Barra de espaço
        e.preventDefault();
        togglePlayPause();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        skipBackward();
        break;
      case 'ArrowRight':
        e.preventDefault();
        skipForward();
        break;
      case 'ArrowUp':
        e.preventDefault();
        changeVolume(0.1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        changeVolume(-0.1);
        break;
      case 'm':
      case 'M':
        e.preventDefault();
        toggleMute();
        break;
      case 'f':
      case 'F':
        e.preventDefault();
        toggleFullscreen();
        break;
      case 'Backspace':
        if (isFullscreen && programId) {
          e.preventDefault();
          exitFullscreen().then(() => {
            // Pequeno delay para garantir que saiu do fullscreen
            setTimeout(() => {
              if (onClose) {
                onClose();
              } else {
                router.push(`/program/${programId}`);
              }
            }, 100);
          });
        }
        break;
      case 'Escape':
        if (isFullscreen) {
          e.preventDefault();
          if (programId) {
            exitFullscreen().then(() => {
              setTimeout(() => {
                if (onClose) {
                  onClose();
                } else {
                  router.push(`/program/${programId}`);
                }
              }, 100);
            });
          } else {
            exitFullscreen();
          }
        }
        break;
      case 'MediaPlayPause':
      case 'PlayPause':
        e.preventDefault();
        togglePlayPause();
        break;
      default:
        // Verifica se é uma tecla de mídia pelo code
        if (isMediaKey || e.code === 'MediaPlayPause' || e.code === 'PlayPause') {
          e.preventDefault();
          togglePlayPause();
        }
        break;
    }

    // Esconde controles após 3 segundos
    const timeout = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
    setControlsTimeout(timeout);
  }, [isPlaying, isFullscreen, programId, router, onClose]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
      }
    };
  }, [handleKeyDown, controlsTimeout]);

  // Entra em fullscreen automaticamente ao carregar
  useEffect(() => {
    const container = containerRef.current;
    if (!container || hasEnteredFullscreen) return;

    const enterFullscreen = async () => {
      try {
        if (container.requestFullscreen) {
          await container.requestFullscreen();
        } else if ((container as any).webkitRequestFullscreen) {
          await (container as any).webkitRequestFullscreen();
        } else if ((container as any).mozRequestFullScreen) {
          await (container as any).mozRequestFullScreen();
        } else if ((container as any).msRequestFullscreen) {
          await (container as any).msRequestFullscreen();
        }
        setHasEnteredFullscreen(true);
      } catch (error) {
        console.error('Erro ao entrar em fullscreen:', error);
      }
    };

    // Pequeno delay para garantir que o DOM está pronto
    const timeout = setTimeout(enterFullscreen, 100);
    return () => clearTimeout(timeout);
  }, [hasEnteredFullscreen]);

  // Detecta mudanças de fullscreen
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );
      setIsFullscreen(isCurrentlyFullscreen);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  // Esconde controles quando o mouse para de se mover (apenas em fullscreen)
  useEffect(() => {
    if (!isFullscreen) {
      setShowControls(true);
      return;
    }

    let mouseMoveTimeout: NodeJS.Timeout;
    const handleMouseMove = () => {
      setShowControls(true);
      if (controlsTimeout) clearTimeout(controlsTimeout);
      if (mouseMoveTimeout) clearTimeout(mouseMoveTimeout);
      
      mouseMoveTimeout = setTimeout(() => {
        if (isPlaying) {
          setShowControls(false);
        }
      }, 3000);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (mouseMoveTimeout) clearTimeout(mouseMoveTimeout);
    };
  }, [isFullscreen, isPlaying, controlsTimeout]);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
    setShowControls(true);
  };

  const skipBackward = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(0, video.currentTime - skipSeconds);
  };

  const skipForward = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.min(video.duration, video.currentTime + skipSeconds);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const changeVolume = (delta: number) => {
    const video = videoRef.current;
    if (!video) return;
    const newVolume = Math.max(0, Math.min(1, video.volume + delta));
    video.volume = newVolume;
    setVolume(newVolume);
    if (newVolume > 0) {
      video.muted = false;
      setIsMuted(false);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const newVolume = parseFloat(e.target.value);
    video.volume = newVolume;
    setVolume(newVolume);
    if (newVolume > 0) {
      video.muted = false;
      setIsMuted(false);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = parseFloat(e.target.value);
  };

  const toggleFullscreen = async () => {
    const container = containerRef.current;
    if (!container) return;

    try {
      if (!isFullscreen) {
        if (container.requestFullscreen) {
          await container.requestFullscreen();
        } else if ((container as any).webkitRequestFullscreen) {
          await (container as any).webkitRequestFullscreen();
        } else if ((container as any).mozRequestFullScreen) {
          await (container as any).mozRequestFullScreen();
        } else if ((container as any).msRequestFullscreen) {
          await (container as any).msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
          await (document as any).mozCancelFullScreen();
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen();
        }
      }
    } catch (error) {
      console.error('Erro ao alternar fullscreen:', error);
    }
  };

  const exitFullscreen = async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        await (document as any).webkitExitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        await (document as any).mozCancelFullScreen();
      } else if ((document as any).msExitFullscreen) {
        await (document as any).msExitFullscreen();
      }
    } catch (error) {
      console.error('Erro ao sair do fullscreen:', error);
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleBack = async () => {
    if (isFullscreen) {
      await exitFullscreen();
      // Pequeno delay para garantir que saiu do fullscreen
      setTimeout(() => {
        if (onClose) {
          onClose();
        } else if (programId) {
          router.push(`/program/${programId}`);
        }
      }, 100);
    } else {
      if (onClose) {
        onClose();
      } else if (programId) {
        router.push(`/program/${programId}`);
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full bg-black ${isFullscreen ? 'fixed inset-0 z-[9999]' : 'min-h-screen'}`}
      onClick={togglePlayPause}
      onMouseMove={() => {
        if (isFullscreen) {
          setShowControls(true);
          if (controlsTimeout) clearTimeout(controlsTimeout);
          const timeout = setTimeout(() => {
            if (isPlaying) setShowControls(false);
          }, 3000);
          setControlsTimeout(timeout);
        }
      }}
    >
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-contain"
        playsInline
        onLoadedMetadata={() => {
          const video = videoRef.current;
          if (video) {
            setDuration(video.duration);
            video.volume = volume;
          }
        }}
      />

      {/* Overlay de controles */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botão voltar (apenas em fullscreen) */}
        {isFullscreen && (
          <button
            onClick={handleBack}
            className="absolute top-4 left-4 z-10 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
            aria-label="Voltar"
          >
            <ArrowLeft className="text-white" size={24} />
          </button>
        )}

        {/* Informações do vídeo (topo) */}
        {title && showControls && (
          <div className="absolute top-4 left-16 right-4">
            <h2 className="text-white text-xl font-bold truncate">{title}</h2>
            {subtitle && (
              <p className="text-white/80 text-sm truncate">{subtitle}</p>
            )}
          </div>
        )}

        {/* Controles principais (centro) */}
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={togglePlayPause}
            className="p-4 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
            aria-label={isPlaying ? 'Pausar' : 'Reproduzir'}
          >
            {isPlaying ? (
              <Pause className="text-white" size={48} />
            ) : (
              <Play className="text-white" size={48} />
            )}
          </button>
        </div>

        {/* Controles inferiores */}
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
          {/* Barra de progresso */}
          <div className="flex items-center gap-2">
            <span className="text-white text-sm min-w-[50px]">{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #bc0000 0%, #bc0000 ${(currentTime / duration) * 100}%, rgba(255,255,255,0.2) ${(currentTime / duration) * 100}%, rgba(255,255,255,0.2) 100%)`
              }}
            />
            <span className="text-white text-sm min-w-[50px]">{formatTime(duration)}</span>
          </div>

          {/* Controles secundários */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Botões de retroceder/avançar */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  skipBackward();
                }}
                className="p-2 hover:bg-white/10 rounded transition-colors"
                aria-label="Retroceder 10 segundos"
              >
                <SkipBack className="text-white" size={24} />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlayPause();
                }}
                className="p-2 hover:bg-white/10 rounded transition-colors"
                aria-label={isPlaying ? 'Pausar' : 'Reproduzir'}
              >
                {isPlaying ? (
                  <Pause className="text-white" size={24} />
                ) : (
                  <Play className="text-white" size={24} />
                )}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  skipForward();
                }}
                className="p-2 hover:bg-white/10 rounded transition-colors"
                aria-label="Avançar 10 segundos"
              >
                <SkipForward className="text-white" size={24} />
              </button>

              {/* Controle de volume */}
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMute();
                  }}
                  className="p-2 hover:bg-white/10 rounded transition-colors"
                  aria-label={isMuted ? 'Ativar som' : 'Desativar som'}
                >
                  {isMuted ? (
                    <VolumeX className="text-white" size={24} />
                  ) : (
                    <Volume2 className="text-white" size={24} />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  onClick={(e) => e.stopPropagation()}
                  className="w-24 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #bc0000 0%, #bc0000 ${volume * 100}%, rgba(255,255,255,0.2) ${volume * 100}%, rgba(255,255,255,0.2) 100%)`
                  }}
                />
              </div>
            </div>

            {/* Botão fullscreen */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFullscreen();
              }}
              className="p-2 hover:bg-white/10 rounded transition-colors"
              aria-label={isFullscreen ? 'Sair do fullscreen' : 'Entrar em fullscreen'}
            >
              {isFullscreen ? (
                <Minimize className="text-white" size={24} />
              ) : (
                <Maximize className="text-white" size={24} />
              )}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #bc0000;
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #bc0000;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
}

