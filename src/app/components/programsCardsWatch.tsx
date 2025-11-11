"use client"

import { useRouter } from "next/navigation";

export default function VideoCardWatch({ image, title, subtitle, showSrc, programId, seasonEpisodes, currentEpisodeIndex, isFocused = false, onFocus }: {image: string, title: string, subtitle: string, showSrc: string, programId?: string, seasonEpisodes?: any[], currentEpisodeIndex?: number, isFocused?: boolean, onFocus?: () => void}) {
  const router = useRouter();

  const handleFullscreen = () => {
    // Sempre redireciona para a página de episódio com o player personalizado
    if (programId && showSrc) {
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
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleFullscreen();
    }
  };

  return (
    <>
      <div
        onClick={handleFullscreen}
        onKeyDown={handleKeyDown}
        onFocus={onFocus}
        tabIndex={isFocused ? 0 : -1}
        data-episode-index={currentEpisodeIndex}
        role="button"
        aria-label={`Assistir ${title}`}
        className={`relative w-[206px] h-[106px] md:w-[343px] md:h-[244px] rounded-xl overflow-hidden border flex-shrink-0 cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#bc0000] ${
          isFocused
            ? 'border-[#bc0000] scale-105 shadow-lg shadow-[#bc0000]/50'
            : 'border-white/20'
        } bg-zinc-800`}>
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
