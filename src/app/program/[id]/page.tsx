"use client"

import { Badge } from "@/components/ui/badge"
import { TabComponent } from "../../components/tabs"
import { urlApi } from "../../../../urlApi"
import TopNav from "../../components/topNav"
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from "react";
import Loader from "@/app/components/loader";
import { useRef } from "react";

function Program({ params }: any ) {

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

  interface Show {
    _id: string; // pode usar `ObjectId` se estiver tipando diretamente com Mongo
    name: string;
    description: string;
    year: string;
    seasonAmount: number;
    tag: string[];
    showFrequency: string;
    showThumbSrc: string;
    season: Season[];
  }

  
  const [tvShow, setTvShows] = useState<Show>();
  const [loading, setLoading] = useState<boolean>(false);

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
    setLoading(true);
    const res = await fetch(urlApi.API_URL + `/tvmax/${params.id}`, {
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
    setLoading(false);
  }, [])

  return (<>
    { loading ? <Loader/> : 
    <div className='min-h-screen h-full w-full bg-[#141414] relative font-[Poppins]'>
        <TopNav />
        
        <div className="w-full min-h-screen h-[56rem] xl:h-[64rem] bg-[url(https://res.cloudinary.com/dmo7nzytn/image/upload/v1755655252/b9c740d1d10c247dc76958a892f54d110022ab2d_zrncwn.jpg)] bg-cover bg-center relative">
          <div className="absolute h-full inset-0 xl:bg-gradient-to-r bg-[#14141449] xl:from-[#141414]  xl:via-transparent xl:via-60% xl:to-transparent">
            <div className="w-full xl:w-[32%] text-white pt-[120px] md:pt-[150px] xl:pt-[188px] px-5 md:px-8 xl:pl-[108px] xl:pr-0">
              {/* Título */}
              <h1 className="text-[28px] md:text-[36px] xl:text-[48px] font-bold leading-tight">{tvShow?.name}</h1>
              
              {/* Ano, Temporada e Tags */}
              <div className="mt-4 md:mt-6 xl:mt-[24px] space-y-3 md:space-y-4">
                {/* Ano e Temporada */}
                <div className="flex flex-wrap items-center gap-4 md:gap-6">
                  {tvShow?.year && (
                    <h2 className="text-sm md:text-base xl:text-lg">{tvShow.year}</h2>
                  )}
                  {tvShow?.seasonAmount && (
                    <h2 className="text-sm md:text-base xl:text-lg">
                      {tvShow.seasonAmount} {tvShow.seasonAmount > 1 ? "Temporadas" : "Temporada"}
                    </h2>
                  )}
                </div>
                
                {/* Tags */}
                {tvShow && tvShow.tag && tvShow.tag.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tvShow.tag.map((category: string, index: number) => (
                      <Badge key={index} variant={'outline'} className="text-white text-xs md:text-sm">
                        {category}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Descrição */}
              {tvShow?.description && (
                <p className="mt-4 md:mt-6 xl:mt-[24px] text-sm md:text-base xl:text-lg leading-relaxed text-gray-200 max-w-full xl:max-w-[26rem]">
                  {tvShow.description}
                </p>
              )}
              
              {/* Botões de ação */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-6 md:mt-8 xl:mt-[44px]">
                <h2 className="text-base md:text-lg xl:text-[18px] font-bold">Assitir T1 E1</h2>
                <div className="flex gap-2">
                  <button className="rounded-full w-[40px] h-[40px] md:w-[48px] md:h-[48px] bg-[#FF383C80] cursor-pointer flex justify-center items-center hover:bg-[#FF383C] transition-colors">
                    <img src="https://res.cloudinary.com/dmo7nzytn/image/upload/v1755708128/Vector_t3kyxt.png" alt="Play" className="w-5 h-5 md:w-6 md:h-6" />
                  </button>
                  <button className="rounded-full w-[40px] h-[40px] md:w-[48px] md:h-[48px] bg-[#FF383C80] cursor-pointer flex justify-center items-center hover:bg-[#FF383C] transition-colors">
                    <img src="https://res.cloudinary.com/dmo7nzytn/image/upload/v1755708126/Vector_1_yhevuf.png" alt="Add to list" className="w-5 h-5 md:w-6 md:h-6" />
                  </button>
                </div>
              </div>
            </div>
            <div className="p-5 xl:pl-[108px] mt-5 xl:mt-20 pb-24 md:pb-5">
              <TabComponent seasons={tvShow && tvShow.season} programId={params.id}/>
            </div>
          </div>
        </div>
      </div>}
    </>
  )
}

export default Program
