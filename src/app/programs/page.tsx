"use client"

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import TopNav from '../components/topNav';
import VideoCardCatalog from '../components/programsCardsCatalog';
import { urlApi } from '../../../urlApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useCatalogNavigation, { CatalogSectionType } from '../hooks/useCatalogNavigation';

interface TvShow {
  id: string;
  name: string;
  showThumbSrc: string;
  showFrequency: string;
}

export default function ProgramsPage() {
  const router = useRouter();
  const [tvShows, setTvShows] = useState<TvShow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Refs para scroll automático
  const headerRef = useRef<HTMLDivElement>(null);
  const programsRef = useRef<HTMLDivElement>(null);
  
  // Menu items
  const menuItems = [
    { label: 'Ao Vivo', href: '/home' },
    { label: 'Programas', href: '/programs' }
  ];
  
  // Navegação com controle remoto
  const sections: CatalogSectionType[] = ['header', 'programs'];
  
  const { 
    focusedSection, 
    focusedProgram,
    focusedMenuItem,
    setFocusedProgram,
    currentSection 
  } = useCatalogNavigation({
    isActive: !loading,
    sections,
    programsCount: tvShows.length,
    menuItemsCount: menuItems.length,
    isMenuOpen,
    onEnter: useCallback((section: CatalogSectionType, itemIndex?: number) => {
      if (section === 'header' && itemIndex !== undefined) {
        const selectedMenuItem = menuItems[itemIndex];
        if (selectedMenuItem) {
          router.push(selectedMenuItem.href);
        }
      } else if (section === 'programs' && itemIndex !== undefined && tvShows[itemIndex]) {
        // Navega para o programa selecionado
        const selectedShow = tvShows[itemIndex];
        router.push(`/program/${selectedShow.id}`);
      }
    }, [router, tvShows, menuItems]),
    onOpenMenu: (fromSection: number) => {
      setIsMenuOpen(true);
    },
    onCloseMenu: () => {
      setIsMenuOpen(false);
    }
  });
  
  // Scroll automático para seção focada
  useEffect(() => {
    const scrollToSection = () => {
      let targetElement: HTMLDivElement | null = null;
      
      switch (focusedSection) {
        case 0: // header
          targetElement = headerRef.current;
          break;
        case 1: // programs
          targetElement = programsRef.current;
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
  
  // Scroll automático para programa focado
  useEffect(() => {
    if (currentSection === 'programs' && programsRef.current) {
      const programCard = programsRef.current.querySelector(`[data-program-index="${focusedProgram}"]`) as HTMLElement;
      if (programCard) {
        programCard.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'center'
        });
      }
    }
  }, [focusedProgram, currentSection]);

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

  async function getTvShows() {
    try {
      const res = await fetch(urlApi.API_URL + `/tvmax`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "ngrok-skip-browser-warning": "69420"
        },
      });

      if (!res.ok) {
        notify(res.statusText);
        throw new Error('Failed to fetch programs');
      }

      const data = await res.json();
      setTvShows(data);
    } catch (error) {
      console.error('Error fetching programs:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getTvShows();
  }, []);

  return (
    <div className="min-h-screen bg-[#141414] text-white font-[Poppins] pb-24 md:pb-14 overflow-x-hidden">
      <div ref={headerRef}>
        <TopNav 
          isFocused={focusedSection === 0 || isMenuOpen} 
          focusedMenuItem={focusedMenuItem}
        />
      </div>
      
      <div className="pt-20 md:pt-32 px-4 md:px-6 lg:px-8 xl:px-12 max-w-full">
        {/* Header */}
        <div className="mb-6 md:mb-12">
          <h1 className="text-2xl md:text-5xl font-bold mb-2">Catálogo de Programas</h1>
          <p className="text-gray-400 text-sm md:text-base">
            Descubra todos os nossos programas e séries
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#bc0000]"></div>
          </div>
        ) : (
          /* Grid de Programas */
          <div 
            ref={programsRef}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4 lg:gap-6 w-full scroll-mt-20"
          >
            {tvShows && tvShows.length > 0 ? (
              tvShows.map((tvShow, index: number) => (
                <VideoCardCatalog
                  key={tvShow.id}
                  image={tvShow.showThumbSrc}
                  title={tvShow.name}
                  subtitle={tvShow.showFrequency}
                  showId={tvShow.id}
                  isFocused={focusedSection === 1 && index === focusedProgram}
                  onFocus={() => setFocusedProgram(index)}
                  data-program-index={index}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-400 text-lg">Nenhum programa encontrado</p>
              </div>
            )}
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

