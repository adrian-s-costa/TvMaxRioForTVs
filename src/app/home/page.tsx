"use client"

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { urlApi } from '../../../urlApi';
import VideoCard from '../components/programsCards'
import TopNav from '../components/topNav';
import Carousel from '../components/carousel';
import SplashScreen from '../components/splashScreen';
import { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useVerticalNavigation, { SectionType } from '../hooks/useVerticalNavigation';

interface FullscreenIframe extends HTMLIFrameElement {
  mozRequestFullScreen?: () => Promise<void> | void;
  webkitRequestFullscreen?: () => Promise<void> | void;
  msRequestFullscreen?: () => Promise<void> | void;
}

interface TvShow {
  id: string;
  name: string;
  showThumbSrc: string;
  showFrequency: string;
}

export default function Home() {
  const router = useRouter();
  const [viewportWidth, setViewportWidth] = useState<number>(0);
  const [tvShows, setTvShows] = useState<TvShow[]>([]);
  const [isPlayerPaused, setIsPlayerPaused] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Refs para scroll automático
  const headerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const programsRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<FullscreenIframe | null>(null);
  
  // Menu items
  const menuItems = [
    { label: 'Ao Vivo', href: '/home' },
    { label: 'Programas', href: '/programs' },
    { label: 'Social', href: '/social' }
  ];
  
  // Navegação vertical com controle remoto
  const sections: SectionType[] = ['header', 'player', 'programs'];
  const { 
    focusedSection, 
    focusedItem, 
    focusedMenuItem,
    setFocusedItem,
    currentSection 
  } = useVerticalNavigation({
    isActive: true,
    sections,
    itemsInProgramsSection: tvShows.length,
    menuItemsCount: menuItems.length,
    isMenuOpen,
    onEnter: (section: SectionType, itemIndex?: number) => {
      if (section === 'header' && itemIndex !== undefined) {
        // Navegar para o item do menu selecionado
        const selectedMenuItem = menuItems[itemIndex];
        if (selectedMenuItem) {
          router.push(selectedMenuItem.href);
        }
      } else if (section === 'player') {
        // Pausar/despausar player
        togglePlayer();
      } else if (section === 'programs' && itemIndex !== undefined && tvShows[itemIndex]) {
        // Navegar para o programa selecionado
        const selectedShow = tvShows[itemIndex];
        router.push(`/program/${selectedShow.id}`);
      }
    },
    onOpenMenu: (fromSection: number) => {
      setIsMenuOpen(true);
    },
    onCloseMenu: () => {
      setIsMenuOpen(false);
    }
  });
  
  // Função para pausar/despausar player
  const togglePlayer = () => {
    // Como é um iframe externo, não podemos controlar diretamente
    // Mas podemos tentar enviar mensagens ou manipular o estado
    setIsPlayerPaused(!isPlayerPaused);
    // Aqui você pode adicionar lógica adicional para controlar o player
  };
  
  // Scroll automático para seção focada
  useEffect(() => {
    const scrollToSection = () => {
      let targetElement: HTMLDivElement | null = null;
      
      switch (focusedSection) {
        case 0: // header
          targetElement = headerRef.current;
          break;
        case 1: // player
          targetElement = playerRef.current;
          break;
        case 2: // programs
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
    
    // Pequeno delay para garantir que o DOM está atualizado
    const timeoutId = setTimeout(scrollToSection, 100);
    
    return () => clearTimeout(timeoutId);
  }, [focusedSection]);
  
  // Atualizar isMenuOpen no hook quando focusedSection mudar
  // Nota: O hook já gerencia isso internamente via isMenuOpen prop
  

  const notify = (text: string) => toast.error(text , {
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
    const res = await fetch(urlApi.API_URL + `/tvmax`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "ngrok-skip-browser-warning": "69420"
      },
    })
    
    if (!res.ok) {
      notify(res.statusText)
      throw new Error('Failed to log in');
    }

    return setTvShows(await res.json())        
  }

  useEffect(() => {
    getTvShows();

    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };

    setViewportWidth(window.innerWidth);

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const [textOpen, setTextOpen] = useState(true);

  const handleFullscreen = () => {
    const iframe = iframeRef.current;

    setTextOpen(false);

    if (!iframe) return;

    if (iframe.requestFullscreen) {
      iframe.requestFullscreen();
    } else if (iframe.mozRequestFullScreen) {
      iframe.mozRequestFullScreen();
    } else if (iframe.webkitRequestFullscreen) {
      iframe.webkitRequestFullscreen();
    } else if (iframe.msRequestFullscreen) {
      iframe.msRequestFullscreen();
    }
  };

  return (
    <>
      <SplashScreen />
      <div className=' w-full bg-[#141414] relative font-[Poppins]'>
        <div 
          ref={headerRef}
          className="scroll-mt-20"
        >
          <TopNav 
            isFocused={focusedSection === 0 || isMenuOpen} 
            focusedMenuItem={focusedMenuItem}
          />
        </div>

        <div 
          ref={playerRef}
          className={`w-full relative md:h-[45rem] md:overflow-x-hidden transition-all duration-200 scroll-mt-20 ${
            focusedSection === 1 ? 'ring-2 ring-[#bc0000] ring-offset-2 ring-offset-[#141414] rounded-lg' : ''
          }`}
        >
          {/* Player em iframe */}
          <iframe
            ref={iframeRef}
            className="md:absolute inset-0 md:w-full md:h-full object-cover"
            src="https://player.logicahost.com.br/player.php?player=1856"
            frameBorder="0"
            allow="autoplay; fullscreen"
            allowFullScreen
            width={viewportWidth}
            height={(viewportWidth / 16) * 9}
          ></iframe>

          {/* Overlay de gradiente */}
          <div 
            onClick={handleFullscreen} 
            className={`absolute md:flex opacity-0 flex inset-0 bg-gradient-to-b md:h-full h-[57vw] from-[#141414] via-transparent to-[#141414] transition-opacity duration-500 ease-in-out ${
              !textOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
          ></div>

          {/* Texto acima do player */}
          <div className={`md:mt-[100%] mt-[${viewportWidth + 'px'}] block md:hidden w-full justify-center h-auto p-5 z-10 backdrop-blur-md `}>
            <h1 className="text-[28px] text-[#bc0000] italic w-full flex justify-center">TV AO VIVO</h1>
            <h2 className="text-[14px] text-center text-[#ffffff] w-full flex justify-center">
              Bem-vindo ao TV MAX Rio! Nosso canal é dedicado a levar até você o melhor
              conteúdo sobre a cidade maravilhosa e seu incrível estilo de vida. Aqui você
              encontra notícias locais, cultura, turismo, esportes, eventos e muito mais,
              tudo com uma pegada dinâmica e atualizada.
            </h2>
          </div> 
        </div>

        <div 
          ref={programsRef}
          className={`mt-14 pb-24 md:pb-14 mx-10 transition-all duration-200 scroll-mt-20 ${
            focusedSection === 2 ? 'ring-2 ring-[#bc0000] ring-offset-2 ring-offset-[#141414] rounded-lg p-2' : ''
          }`}
        >
          <Carousel 
            title="Programas"
            railIndex={0}
            focusedItemIndex={focusedItem}
            isFocused={focusedSection === 2}
            onItemFocus={setFocusedItem}
          >
            {tvShows && tvShows
              .map((tvShow: any, index: number) => {
                return <VideoCard
                  image={tvShow.showThumbSrc}
                  title={tvShow.name}
                  subtitle={tvShow.showFrequency} 
                  showId={tvShow.id}
                  key={tvShow.id}
                  isFocused={focusedSection === 2 && index === focusedItem}
                />
              })}
          </Carousel>
        </div>
      </div>
    </>
  )
}
