"use client"

import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useParams, useRouter } from 'next/navigation';
import CustomVideoPlayer from '../../../components/customVideoPlayer';
import { urlApi } from '../../../../urlApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function EpisodePage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [src, setSrc] = useState('');
  const [image, setImage] = useState('');
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    // Obtém parâmetros da URL
    const urlTitle = searchParams.get('title');
    const urlSubtitle = searchParams.get('subtitle');
    const urlSrc = searchParams.get('src');
    const urlImage = searchParams.get('image');
    const urlEpisodeIndex = searchParams.get('episodeIndex');
    const urlEpisodes = searchParams.get('episodes');

    if (urlTitle) setTitle(urlTitle);
    if (urlSubtitle) setSubtitle(urlSubtitle);
    if (urlSrc) setSrc(urlSrc);
    if (urlImage) setImage(urlImage);
    if (urlEpisodeIndex) setCurrentEpisodeIndex(parseInt(urlEpisodeIndex, 10));

    if (urlEpisodes) {
      try {
        const parsedEpisodes = JSON.parse(urlEpisodes);
        setEpisodes(parsedEpisodes);
      } catch (error) {
        console.error('Erro ao parsear episódios:', error);
      }
    }

    setLoading(false);
  }, [searchParams]);

  const handleClose = () => {
    if (params.id) {
      router.push(`/program/${params.id}`);
    } else {
      router.back();
    }
  };

  const handleNextEpisode = () => {
    if (currentEpisodeIndex < episodes.length - 1) {
      const nextIndex = currentEpisodeIndex + 1;
      const nextEpisode = episodes[nextIndex];
      
      setCurrentEpisodeIndex(nextIndex);
      setTitle(nextEpisode.name || '');
      setSubtitle(nextEpisode.description || '');
      setSrc(nextEpisode.source || '');
      setImage(nextEpisode.thumbnailSrc || '');
      
      // Atualiza a URL sem recarregar a página
      const newParams = new URLSearchParams({
        title: nextEpisode.name || '',
        subtitle: nextEpisode.description || '',
        src: nextEpisode.source || '',
        image: nextEpisode.thumbnailSrc || '',
        programId: params.id as string,
        episodeIndex: nextIndex.toString()
      });
      
      if (episodes.length > 0) {
        newParams.set('episodes', JSON.stringify(episodes));
      }
      
      router.replace(`/program/${params.id}/episode?${newParams.toString()}`, { scroll: false });
    }
  };

  const handlePreviousEpisode = () => {
    if (currentEpisodeIndex > 0) {
      const prevIndex = currentEpisodeIndex - 1;
      const prevEpisode = episodes[prevIndex];
      
      setCurrentEpisodeIndex(prevIndex);
      setTitle(prevEpisode.name || '');
      setSubtitle(prevEpisode.description || '');
      setSrc(prevEpisode.source || '');
      setImage(prevEpisode.thumbnailSrc || '');
      
      // Atualiza a URL sem recarregar a página
      const newParams = new URLSearchParams({
        title: prevEpisode.name || '',
        subtitle: prevEpisode.description || '',
        src: prevEpisode.source || '',
        image: prevEpisode.thumbnailSrc || '',
        programId: params.id as string,
        episodeIndex: prevIndex.toString()
      });
      
      if (episodes.length > 0) {
        newParams.set('episodes', JSON.stringify(episodes));
      }
      
      router.replace(`/program/${params.id}/episode?${newParams.toString()}`, { scroll: false });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#141414] text-white font-[Poppins] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#bc0000]"></div>
      </div>
    );
  }

  if (!src) {
    return (
      <div className="min-h-screen bg-[#141414] text-white font-[Poppins] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 text-lg mb-4">Episódio não encontrado</p>
          <button
            onClick={handleClose}
            className="px-6 py-2 bg-[#bc0000] text-white rounded-lg hover:bg-[#bc0000]/80 transition-colors"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141414] text-white font-[Poppins]">
      <CustomVideoPlayer
        src={src}
        title={title}
        subtitle={subtitle}
        programId={params.id as string}
        onClose={handleClose}
        skipSeconds={10}
      />
      
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

