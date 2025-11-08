"use client"

import { useEffect, useState } from 'react';
import TopNav from '../components/topNav';
import VideoCardCatalog from '../components/programsCardsCatalog';
import { urlApi } from '../../../urlApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ProgramsPage() {
  const [tvShows, setTvShows] = useState([]);
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
      <TopNav />
      
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4 lg:gap-6 w-full">
            {tvShows && tvShows.length > 0 ? (
              tvShows.map((tvShow: any) => (
                <VideoCardCatalog
                  key={tvShow.id}
                  image={tvShow.showThumbSrc}
                  title={tvShow.name}
                  subtitle={tvShow.showFrequency}
                  showId={tvShow.id}
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

