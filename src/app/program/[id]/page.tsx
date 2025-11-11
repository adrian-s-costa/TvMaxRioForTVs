"use client"

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import TopNav from '../../components/topNav';
import { TabComponent } from '../../components/tabs';
import { urlApi } from '../../../../urlApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import useProgramNavigation, { ProgramSectionType } from '../../hooks/useProgramNavigation';

interface Episode {
  name: string;
  description: string;
  source: string;
  thumbnailSrc: string;
  frequency: string;
}

interface Season {
  name: string;
  episodes: Episode[];
}

interface TvShow {
  _id: string;
  name: string;
  description: string;
  year: string;
  seasonAmount: number;
  tag: string[];
  showFrequency: string;
  showThumbSrc: string;
  season: Season[];
}

export default function ProgramPage() {
  const params = useParams();
  const router = useRouter();
  const [tvShow, setTvShow] = useState<TvShow | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Refs para scroll automático
  const headerRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const seasonsRef = useRef<HTMLDivElement>(null);
  const episodesRef = useRef<HTMLDivElement>(null);
  
  // Menu items
  const menuItems = [
    { label: 'Ao Vivo', href: '/home' },
    { label: 'Programas', href: '/programs' }
  ];
  
  // Navegação com controle remoto
  const sections: ProgramSectionType[] = ['header', 'info', 'seasons', 'episodes'];
  const programId = params.id as string;
  
  // Ref para armazenar o callback de onEnter que terá acesso aos valores atualizados
  const onEnterRef = useRef<((section: ProgramSectionType, itemIndex?: number, seasonIndex?: number) => void) | null>(null);
  
  const { 
    focusedSection, 
    focusedSeason,
    focusedEpisode,
    focusedMenuItem,
    setFocusedSeason,
    setFocusedEpisode,
    currentSection 
  } = useProgramNavigation({
    isActive: !loading && !!tvShow,
    sections,
    seasonsCount: tvShow?.season?.length || 0,
    getEpisodesCount: (seasonIndex: number) => tvShow?.season?.[seasonIndex]?.episodes?.length || 0,
    menuItemsCount: menuItems.length,
    isMenuOpen,
    onEnter: (section: ProgramSectionType, itemIndex?: number, seasonIndex?: number) => {
      if (onEnterRef.current) {
        onEnterRef.current(section, itemIndex, seasonIndex);
      }
    },
    onOpenMenu: (fromSection: number) => {
      setIsMenuOpen(true);
    },
    onCloseMenu: () => {
      setIsMenuOpen(false);
    }
  });
  
  // Reset episódio quando muda de temporada
  useEffect(() => {
    setFocusedEpisode(0);
  }, [focusedSeason, setFocusedEpisode]);

  // Atualiza o callback onEnter com acesso aos valores atuais
  useEffect(() => {
    onEnterRef.current = (section: ProgramSectionType, itemIndex?: number, seasonIndex?: number) => {
      if (section === 'header' && itemIndex !== undefined) {
        const selectedMenuItem = menuItems[itemIndex];
        if (selectedMenuItem) {
          router.push(selectedMenuItem.href);
        }
      } else if (section === 'episodes' && itemIndex !== undefined && tvShow) {
        // Usa o seasonIndex passado pelo hook, ou o focusedSeason atual como fallback
        const currentSeasonIndex = seasonIndex !== undefined ? seasonIndex : focusedSeason;
        const selectedSeason = tvShow.season?.[currentSeasonIndex];
        const selectedEpisode = selectedSeason?.episodes?.[itemIndex];
        
        if (selectedEpisode && selectedEpisode.source && programId) {
          const params = new URLSearchParams({
            title: selectedEpisode.name || '',
            subtitle: selectedEpisode.description || '',
            src: selectedEpisode.source || '',
            image: selectedEpisode.thumbnailSrc || '',
            programId: programId,
            episodeIndex: itemIndex.toString()
          });
          
          // Adiciona informações dos episódios da temporada se disponível
          if (selectedSeason && selectedSeason.episodes && selectedSeason.episodes.length > 0) {
            params.set('episodes', JSON.stringify(selectedSeason.episodes));
          }
          
          router.push(`/program/${programId}/episode?${params.toString()}`);
        }
      }
    };
  }, [tvShow, programId, focusedSeason, router, menuItems]);
  
  // Scroll automático para seção focada
  useEffect(() => {
    const scrollToSection = () => {
      let targetElement: HTMLDivElement | null = null;
      
      switch (focusedSection) {
        case 0: // header
          targetElement = headerRef.current;
          break;
        case 1: // info
          targetElement = infoRef.current;
          break;
        case 2: // seasons
          targetElement = seasonsRef.current;
          break;
        case 3: // episodes
          targetElement = episodesRef.current;
          break;
      }
      
      if (targetElement) {
        targetElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    };
    
    const timeoutId = setTimeout(scrollToSection, 100);
    return () => clearTimeout(timeoutId);
  }, [focusedSection]);

  const notify = (text: string) => toast.error(text, {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });

  async function getTvShow() {
    setLoading(true);
    try {
      const res = await fetch(urlApi.API_URL + `/tvmax/${params.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "ngrok-skip-browser-warning": "69420"
        },
      });
      
      if (!res.ok) {
        notify(res.statusText);
        throw new Error('Failed to fetch program');
      }

      const data = await res.json();
      setTvShow(data);
    } catch (error) {
      console.error('Error fetching program:', error);
      notify('Erro ao carregar programa');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (params.id) {
      getTvShow();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#141414] text-white font-[Poppins] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#bc0000]"></div>
      </div>
    );
  }

  if (!tvShow) {
    return (
      <div className="min-h-screen bg-[#141414] text-white font-[Poppins] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 text-lg mb-4">Programa não encontrado</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-[#bc0000] text-white rounded-lg hover:bg-[#bc0000]/80 transition-colors"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141414] text-white font-[Poppins] pb-24 md:pb-14">
      <div ref={headerRef}>
        <TopNav 
          isFocused={focusedSection === 0 || isMenuOpen} 
          focusedMenuItem={focusedMenuItem}
        />
      </div>
      
      <div className="pt-20 md:pt-32 px-4 md:px-6 lg:px-8 xl:px-12 max-w-full">
        {/* Botão Voltar */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Voltar</span>
        </button>

        {/* Header do Programa */}
        <div 
          ref={infoRef}
          className="mb-8 md:mb-12 transition-all duration-200 scroll-mt-20"
        >
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            {/* Thumbnail */}
            <div className="flex-shrink-0">
              <img
                src={tvShow.showThumbSrc}
                alt={tvShow.name}
                className="w-full md:w-[400px] lg:w-[500px] rounded-xl object-cover shadow-2xl"
              />
            </div>

            {/* Informações do Programa */}
            <div className="flex-1 flex flex-col justify-center">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4">
                {tvShow.name}
              </h1>
              
              {tvShow.year && (
                <p className="text-gray-400 text-lg md:text-xl mb-4">
                  {tvShow.year}
                </p>
              )}

              {tvShow.showFrequency && (
                <p className="text-[#bc0000] text-base md:text-lg mb-4 font-semibold">
                  {tvShow.showFrequency}
                </p>
              )}

              {tvShow.description && (
                <p className="text-gray-300 text-sm md:text-base leading-relaxed max-w-2xl">
                  {tvShow.description}
                </p>
              )}

              {tvShow.tag && tvShow.tag.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {tvShow.tag.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-white/10 rounded-full text-xs md:text-sm text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Temporadas e Episódios */}
        {tvShow.season && tvShow.season.length > 0 ? (
          <div className="mt-8">
            <div ref={seasonsRef} className="scroll-mt-20">
              <div ref={episodesRef} className="scroll-mt-20">
                <TabComponent 
                  seasons={tvShow.season} 
                  programId={tvShow._id}
                  focusedSeason={focusedSeason}
                  isSeasonsFocused={focusedSection === 2}
                  onSeasonChange={setFocusedSeason}
                  focusedEpisode={focusedEpisode}
                  isEpisodesFocused={focusedSection === 3}
                  onEpisodeFocus={setFocusedEpisode}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">Nenhuma temporada disponível</p>
          </div>
        )}
      </div>

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
    </div>
  );
}

