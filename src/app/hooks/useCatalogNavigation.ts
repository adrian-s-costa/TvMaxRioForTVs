import { useCallback, useEffect, useState, useRef } from "react"

export type CatalogSectionType = 'header' | 'programs'

interface UseCatalogNavigationProps {
  isActive: boolean
  sections: CatalogSectionType[]
  programsCount?: number
  menuItemsCount?: number
  isMenuOpen?: boolean
  onEnter?: (section: CatalogSectionType, itemIndex?: number) => void
  onOpenMenu?: (fromSection: number) => void
  onCloseMenu?: () => void
}

interface UseCatalogNavigationReturn {
  focusedSection: number
  focusedProgram: number
  focusedMenuItem: number
  setFocusedSection: (index: number) => void
  setFocusedProgram: (index: number) => void
  setFocusedMenuItem: (index: number) => void
  currentSection: CatalogSectionType
  previousSectionRef: React.MutableRefObject<number>
}

const useCatalogNavigation = ({ 
  isActive, 
  sections,
  programsCount = 0,
  menuItemsCount = 0,
  isMenuOpen = false,
  onEnter,
  onOpenMenu,
  onCloseMenu
}: UseCatalogNavigationProps): UseCatalogNavigationReturn => {
  const [focusedSection, setFocusedSection] = useState(1) // Começa na seção 'programs'
  const [focusedProgram, setFocusedProgram] = useState(0)
  const [focusedMenuItem, setFocusedMenuItem] = useState(0)
  const previousSectionRef = useRef<number>(1)

  const currentSection = sections[focusedSection] || 'programs'
  const menuIsOpen = focusedSection === 0 || isMenuOpen

  const moveUp = useCallback(() => {
    if (menuIsOpen && currentSection === 'header') {
      setFocusedMenuItem((currentMenuItem) => {
        const newMenuItem = currentMenuItem - 1
        return newMenuItem >= 0 ? newMenuItem : 0
      })
    } else if (currentSection === 'programs') {
      // Vai para o header
      setFocusedSection(0)
    }
  }, [menuIsOpen, currentSection])

  const moveDown = useCallback(() => {
    if (menuIsOpen && currentSection === 'header') {
      setFocusedMenuItem((currentMenuItem) => {
        const newMenuItem = currentMenuItem + 1
        return newMenuItem < menuItemsCount ? newMenuItem : menuItemsCount - 1
      })
    } else if (currentSection === 'header') {
      // Vai para programs
      setFocusedSection(1)
      setFocusedProgram(0)
    }
  }, [menuIsOpen, currentSection, menuItemsCount])

  const moveLeft = useCallback(() => {
    if (menuIsOpen && focusedSection === 0) {
      setFocusedMenuItem((currentMenuItem) => {
        const newMenuItem = currentMenuItem - 1
        return newMenuItem >= 0 ? newMenuItem : 0
      })
    } else if (currentSection === 'programs') {
      // Se está no primeiro item, abre o menu
      if (focusedProgram === 0 && onOpenMenu) {
        previousSectionRef.current = focusedSection
        onOpenMenu(focusedSection)
        setFocusedSection(0)
        setFocusedMenuItem(0)
      } else {
        // Navega entre programas
        setFocusedProgram((currentProgram) => {
          const newProgram = currentProgram - 1
          return newProgram >= 0 ? newProgram : 0
        })
      }
    }
  }, [currentSection, focusedSection, focusedProgram, menuIsOpen, onOpenMenu])

  const moveRight = useCallback(() => {
    if (menuIsOpen && focusedSection === 0) {
      if (onCloseMenu) {
        onCloseMenu()
        setFocusedSection(previousSectionRef.current)
      }
    } else if (currentSection === 'programs') {
      // Navega entre programas
      setFocusedProgram((currentProgram) => {
        const newProgram = currentProgram + 1
        return newProgram < programsCount ? newProgram : programsCount - 1
      })
    }
  }, [currentSection, programsCount, menuIsOpen, focusedSection, onCloseMenu])

  const handleEnter = useCallback(() => {
    if (onEnter) {
      if (menuIsOpen && focusedSection === 0) {
        onEnter(currentSection, focusedMenuItem)
        if (onCloseMenu) onCloseMenu()
      } else if (currentSection === 'programs') {
        onEnter(currentSection, focusedProgram)
      }
    }
  }, [onEnter, currentSection, focusedProgram, focusedMenuItem, menuIsOpen, focusedSection, onCloseMenu])

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
        }
        break
      default:
        break
    }
  }, [isActive, moveUp, moveDown, moveLeft, moveRight, handleEnter, menuIsOpen, onCloseMenu])

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
    if (currentSection === 'programs') {
      if (focusedProgram >= programsCount && programsCount > 0) {
        setFocusedProgram(programsCount - 1)
      }
    } else if (currentSection === 'header') {
      if (focusedMenuItem >= menuItemsCount && menuItemsCount > 0) {
        setFocusedMenuItem(menuItemsCount - 1)
      }
    }
  }, [currentSection, programsCount, focusedProgram, menuItemsCount, focusedMenuItem])

  return { 
    focusedSection, 
    focusedProgram,
    focusedMenuItem,
    setFocusedSection,
    setFocusedProgram,
    setFocusedMenuItem,
    currentSection,
    previousSectionRef
  }
}

export default useCatalogNavigation

