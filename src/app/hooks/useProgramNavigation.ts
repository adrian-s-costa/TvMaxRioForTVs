import { useCallback, useEffect, useState, useRef } from "react"

export type ProgramSectionType = 'header' | 'info' | 'seasons' | 'episodes'

interface UseProgramNavigationProps {
  isActive: boolean
  sections: ProgramSectionType[]
  seasonsCount?: number
  getEpisodesCount?: (seasonIndex: number) => number
  episodesCount?: number
  menuItemsCount?: number
  isMenuOpen?: boolean
  onEnter?: (section: ProgramSectionType, itemIndex?: number, seasonIndex?: number) => void
  onOpenMenu?: (fromSection: number) => void
  onCloseMenu?: () => void
}

interface UseProgramNavigationReturn {
  focusedSection: number
  focusedSeason: number
  focusedEpisode: number
  focusedMenuItem: number
  setFocusedSection: (index: number) => void
  setFocusedSeason: (index: number) => void
  setFocusedEpisode: (index: number) => void
  setFocusedMenuItem: (index: number) => void
  currentSection: ProgramSectionType
  previousSectionRef: React.MutableRefObject<number>
}

const useProgramNavigation = ({ 
  isActive, 
  sections,
  seasonsCount = 0,
  getEpisodesCount,
  episodesCount = 0,
  menuItemsCount = 0,
  isMenuOpen = false,
  onEnter,
  onOpenMenu,
  onCloseMenu
}: UseProgramNavigationProps): UseProgramNavigationReturn => {
  const [focusedSection, setFocusedSection] = useState(1) // Começa na seção 'info'
  const [focusedSeason, setFocusedSeason] = useState(0)
  const [focusedEpisode, setFocusedEpisode] = useState(0)
  const [focusedMenuItem, setFocusedMenuItem] = useState(0)
  const previousSectionRef = useRef<number>(1)

  const currentSection = sections[focusedSection] || 'info'
  const menuIsOpen = focusedSection === 0 || isMenuOpen

  const moveUp = useCallback(() => {
    if (menuIsOpen && currentSection === 'header') {
      setFocusedMenuItem((currentMenuItem) => {
        const newMenuItem = currentMenuItem - 1
        return newMenuItem >= 0 ? newMenuItem : 0
      })
    } else if (currentSection === 'episodes') {
      // Se estiver nos episódios, volta para temporadas
      setFocusedSection(sections.indexOf('seasons'))
      setFocusedEpisode(0)
    } else if (currentSection === 'seasons') {
      // Se estiver nas temporadas, volta para info
      setFocusedSection(sections.indexOf('info'))
      setFocusedSeason(0)
    } else if (currentSection === 'info') {
      // Se estiver na info, vai para header
      setFocusedSection(0)
    }
  }, [menuIsOpen, currentSection, sections])

  const moveDown = useCallback(() => {
    if (menuIsOpen && currentSection === 'header') {
      setFocusedMenuItem((currentMenuItem) => {
        const newMenuItem = currentMenuItem + 1
        return newMenuItem < menuItemsCount ? newMenuItem : menuItemsCount - 1
      })
    } else if (currentSection === 'header') {
      // Se estiver no header, vai para info
      setFocusedSection(sections.indexOf('info'))
    } else if (currentSection === 'info') {
      // Se estiver na info, vai para temporadas
      setFocusedSection(sections.indexOf('seasons'))
      setFocusedSeason(0)
    } else if (currentSection === 'seasons') {
      // Se estiver nas temporadas, vai para episódios
      setFocusedSection(sections.indexOf('episodes'))
      setFocusedEpisode(0)
    }
  }, [menuIsOpen, currentSection, sections, menuItemsCount])

  const moveLeft = useCallback(() => {
    if (menuIsOpen && focusedSection === 0) {
      setFocusedMenuItem((currentMenuItem) => {
        const newMenuItem = currentMenuItem - 1
        return newMenuItem >= 0 ? newMenuItem : 0
      })
    } else if (currentSection === 'seasons') {
      // Se está no primeiro item (índice 0), abre o menu lateral
      if (focusedSeason === 0 && onOpenMenu) {
        previousSectionRef.current = focusedSection
        onOpenMenu(focusedSection)
        setFocusedSection(0)
        setFocusedMenuItem(0)
      } else {
        // Navega entre temporadas
        setFocusedSeason((currentSeason) => {
          const newSeason = currentSeason - 1
          return newSeason >= 0 ? newSeason : 0
        })
      }
    } else if (currentSection === 'episodes') {
      // Se está no primeiro item (índice 0), abre o menu lateral
      if (focusedEpisode === 0 && onOpenMenu) {
        previousSectionRef.current = focusedSection
        onOpenMenu(focusedSection)
        setFocusedSection(0)
        setFocusedMenuItem(0)
      } else {
        // Navega entre episódios
        setFocusedEpisode((currentEpisode) => {
          const newEpisode = currentEpisode - 1
          return newEpisode >= 0 ? newEpisode : 0
        })
      }
    } else if (currentSection === 'info') {
      // Abre menu
      if (onOpenMenu) {
        previousSectionRef.current = focusedSection
        onOpenMenu(focusedSection)
        setFocusedSection(0)
        setFocusedMenuItem(0)
      }
    }
  }, [currentSection, focusedSection, focusedSeason, focusedEpisode, menuIsOpen, onOpenMenu])

  const moveRight = useCallback(() => {
    if (menuIsOpen && focusedSection === 0) {
      if (onCloseMenu) {
        onCloseMenu()
        // Volta para a seção anterior mantendo os índices
        const previousSectionIndex = previousSectionRef.current
        setFocusedSection(previousSectionIndex)
        // Se voltar para seasons ou episodes, mantém os índices atuais
        // (não reseta para 0)
      }
    } else if (currentSection === 'seasons') {
      // Navega entre temporadas
      setFocusedSeason((currentSeason) => {
        const newSeason = currentSeason + 1
        return newSeason < seasonsCount ? newSeason : seasonsCount - 1
      })
    } else if (currentSection === 'episodes') {
      // Navega entre episódios
      const currentEpisodesCount = getEpisodesCount ? getEpisodesCount(focusedSeason) : episodesCount
      setFocusedEpisode((currentEpisode) => {
        const newEpisode = currentEpisode + 1
        return newEpisode < currentEpisodesCount ? newEpisode : currentEpisodesCount - 1
      })
    }
  }, [currentSection, seasonsCount, episodesCount, getEpisodesCount, focusedSeason, menuIsOpen, focusedSection, onCloseMenu])

  const handleEnter = useCallback(() => {
    if (onEnter) {
      if (menuIsOpen && focusedSection === 0) {
        onEnter(currentSection, focusedMenuItem)
        if (onCloseMenu) onCloseMenu()
      } else if (currentSection === 'seasons') {
        // Ao pressionar Enter em uma temporada, vai para os episódios dessa temporada
        setFocusedSection(sections.indexOf('episodes'))
        setFocusedEpisode(0)
      } else if (currentSection === 'episodes') {
        // Ao pressionar Enter em um episódio, seleciona o episódio
        // Passa também o índice da temporada atual
        onEnter(currentSection, focusedEpisode, focusedSeason)
      }
    }
  }, [onEnter, currentSection, focusedEpisode, focusedSeason, focusedMenuItem, menuIsOpen, focusedSection, sections, onCloseMenu])

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isActive) return

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault()
        moveUp()
        break
      case 'ArrowDown':
        e.preventDefault()
        moveDown()
        break
      case 'ArrowLeft':
        e.preventDefault()
        moveLeft()
        break
      case 'ArrowRight':
        e.preventDefault()
        moveRight()
        break
      case 'Enter':
        e.preventDefault()
        handleEnter()
        break
      case 'Escape':
        e.preventDefault()
        if (menuIsOpen && onCloseMenu) {
          onCloseMenu()
          setFocusedSection(previousSectionRef.current)
        } else if (currentSection === 'episodes') {
          setFocusedSection(sections.indexOf('seasons'))
          setFocusedEpisode(0)
        } else if (currentSection === 'seasons') {
          setFocusedSection(sections.indexOf('info'))
          setFocusedSeason(0)
        }
        break
      default:
        break
    }
  }, [isActive, moveUp, moveDown, moveLeft, moveRight, handleEnter, menuIsOpen, currentSection, sections, onCloseMenu])

  useEffect(() => {
    if (isActive) {
      window.addEventListener('keydown', onKeyDown)
      return () => {
        window.removeEventListener('keydown', onKeyDown)
      }
    }
  }, [isActive, onKeyDown])

  // Reset focused items quando muda de seção
  useEffect(() => {
    if (currentSection === 'episodes') {
      const currentEpisodesCount = getEpisodesCount ? getEpisodesCount(focusedSeason) : episodesCount
      if (focusedEpisode >= currentEpisodesCount && currentEpisodesCount > 0) {
        setFocusedEpisode(currentEpisodesCount - 1)
      }
    } else if (currentSection === 'seasons') {
      if (focusedSeason >= seasonsCount && seasonsCount > 0) {
        setFocusedSeason(seasonsCount - 1)
      }
    } else if (currentSection === 'header') {
      if (focusedMenuItem >= menuItemsCount && menuItemsCount > 0) {
        setFocusedMenuItem(menuItemsCount - 1)
      }
    }
  }, [currentSection, episodesCount, getEpisodesCount, focusedSeason, focusedEpisode, seasonsCount, menuItemsCount, focusedMenuItem])

  return { 
    focusedSection, 
    focusedSeason,
    focusedEpisode,
    focusedMenuItem,
    setFocusedSection,
    setFocusedSeason,
    setFocusedEpisode,
    setFocusedMenuItem,
    currentSection,
    previousSectionRef
  }
}

export default useProgramNavigation

