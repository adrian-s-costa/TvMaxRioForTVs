"use client"

import { useState, useEffect } from "react";
import VideoCardWatch from "./programsCardsWatch";
import { EpisodesCarousel } from "./episodesCarousel";

interface TabComponentProps {
  seasons: any;
  programId?: string;
  focusedSeason?: number;
  isSeasonsFocused?: boolean;
  onSeasonChange?: (index: number) => void;
  focusedEpisode?: number;
  isEpisodesFocused?: boolean;
  onEpisodeFocus?: (index: number) => void;
}

export function TabComponent({ 
  seasons, 
  programId,
  focusedSeason = 0,
  isSeasonsFocused = false,
  onSeasonChange,
  focusedEpisode = 0,
  isEpisodesFocused = false,
  onEpisodeFocus
}: TabComponentProps) {
  const [activeTab, setActiveTab] = useState(0);

  // Sincroniza o tab ativo com o foco
  useEffect(() => {
    if (isSeasonsFocused && focusedSeason !== activeTab) {
      setActiveTab(focusedSeason);
    }
  }, [focusedSeason, isSeasonsFocused, activeTab]);

  // Quando a temporada focada muda, atualiza o tab ativo
  useEffect(() => {
    if (onSeasonChange && activeTab !== focusedSeason) {
      onSeasonChange(activeTab);
    }
  }, [activeTab, focusedSeason, onSeasonChange]);

  return (
    <div className="w-full">
      <div className="mb-4">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {seasons && seasons.map((season: any, seasonIndex: number) => (
            <button
              key={seasonIndex}
              onClick={() => {
                setActiveTab(seasonIndex);
                onSeasonChange?.(seasonIndex);
              }}
              className={`px-4 py-2 rounded-t-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === seasonIndex
                  ? 'border-b-2 border-white text-white'
                  : 'border-b-2 border-transparent text-gray-500 hover:text-gray-300'
              } ${
                isSeasonsFocused && focusedSeason === seasonIndex
                  ? 'ring-2 ring-[#bc0000] rounded-lg'
                  : ''
              }`}
            >
              {season.name}
            </button>
          ))}
        </div>
      </div>

      {seasons && seasons.map((season: any, seasonIndex: number) => {
        const isActive = activeTab === seasonIndex;
        return (
          <div key={seasonIndex} style={{ display: isActive ? 'block' : 'none' }}>
            <EpisodesCarousel 
              title={season.name}
              focusedItemIndex={focusedEpisode}
              isFocused={isEpisodesFocused && isActive}
              onItemFocus={onEpisodeFocus}
            >
              {season.episodes.map((episode: any, episodeIndex: number)=>{
                return <VideoCardWatch
                  key={episodeIndex}
                  image={episode.thumbnailSrc}
                  title={episode.name}
                  subtitle={episode.description}
                  showSrc={episode.source}
                  programId={programId}
                  seasonEpisodes={season.episodes}
                  currentEpisodeIndex={episodeIndex}
                  isFocused={isEpisodesFocused && isActive && episodeIndex === focusedEpisode}
                />
              })}
            </EpisodesCarousel>
          </div>
        );
      })}
    </div>
  );
}
