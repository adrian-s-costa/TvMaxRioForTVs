import { useCallback, useEffect, useState, useRef } from "react"

export type SectionType = 'header' | 'player' | 'programs'

interface UseVerticalNavigationProps {
  isActive: boolean
  sections: SectionType[]
  itemsInProgramsSection?: number
  menuItemsCount?: number
  isMenuOpen?: boolean
  onEnter?: (section: SectionType, itemIndex?: number) => void
  onOpenMenu?: (fromSection: number) => void
  onCloseMenu?: () => void
}

interface UseVerticalNavigationReturn {
  focusedSection: number
  focusedItem: number
  focusedMenuItem: number
  setFocusedSection: (index: number) => void
  setFocusedItem: (index: number) => void
  setFocusedMenuItem: (index: number) => void
  currentSection: SectionType
  previousSectionRef: React.MutableRefObject<number>
}

const useVerticalNavigation = ({ 
  isActive, 
  sections,
  itemsInProgramsSection = 0,
  menuItemsCount = 0,
  isMenuOpen = false,
  onEnter,
  onOpenMenu,
  onCloseMenu
}: UseVerticalNavigationProps): UseVerticalNavigationReturn => {
  const [focusedSection, setFocusedSection] = useState(0)
  const [focusedItem, setFocusedItem] = useState(0)
  const [focusedMenuItem, setFocusedMenuItem] = useState(0)
  const previousSectionRef = useRef<number>(1) // Rastreia seção anterior

  const currentSection = sections[focusedSection] || 'header'
  // Menu está aberto quando header está focado ou quando isMenuOpen é true
  const menuIsOpen = focusedSection === 0 || isMenuOpen

  const moveUp = useCallback(() => {
    // Se o menu estiver aberto e estiver na seção header, navega no menu
    if (menuIsOpen && currentSection === 'header') {
      setFocusedMenuItem((currentMenuItem) => {
        const newMenuItem = currentMenuItem - 1
        return newMenuItem >= 0 ? newMenuItem : 0
      })
    } else {
      setFocusedSection((currentSection) => {
        const newSection = currentSection - 1
        return newSection >= 0 ? newSection : 0
      })
      // Reset item quando muda de seção
      setFocusedItem(0)
    }
  }, [menuIsOpen, currentSection])

  const moveDown = useCallback(() => {
    // Se o menu estiver aberto e estiver na seção header, navega no menu
    if (menuIsOpen && currentSection === 'header') {
      setFocusedMenuItem((currentMenuItem) => {
        const newMenuItem = currentMenuItem + 1
        return newMenuItem < menuItemsCount ? newMenuItem : menuItemsCount - 1
      })
    } else {
      setFocusedSection((currentSection) => {
        const newSection = currentSection + 1
        return newSection < sections.length ? newSection : sections.length - 1
      })
      // Reset item quando muda de seção
      setFocusedItem(0)
    }
  }, [menuIsOpen, currentSection, sections.length, menuItemsCount])

  const moveLeft = useCallback(() => {
    // Se o menu estiver aberto, navega no menu
    if (menuIsOpen && focusedSection === 0) {
      setFocusedMenuItem((currentMenuItem) => {
        const newMenuItem = currentMenuItem - 1
        return newMenuItem >= 0 ? newMenuItem : 0
      })
    }
    // Se estiver no player (seção única), abre a barra lateral
    else if (currentSection === 'player') {
      if (onOpenMenu) {
        previousSectionRef.current = focusedSection // Salva seção atual
        onOpenMenu(focusedSection) // Passa a seção atual
        setFocusedSection(0) // Foca no header/menu
        setFocusedMenuItem(0)
      }
    }
    // Se estiver na seção de programas e no primeiro item, abre a barra lateral
    else if (currentSection === 'programs' && focusedItem === 0) {
      if (onOpenMenu) {
        previousSectionRef.current = focusedSection // Salva seção atual
        onOpenMenu(focusedSection) // Passa a seção atual
        setFocusedSection(0) // Foca no header/menu
        setFocusedMenuItem(0)
      }
    }
    // Caso contrário, navega normalmente na seção de programas
    else if (currentSection === 'programs') {
      setFocusedItem((currentItem) => {
        const newItem = currentItem - 1
        return newItem >= 0 ? newItem : 0
      })
    }
  }, [currentSection, focusedItem, menuIsOpen, focusedSection, onOpenMenu])

  const moveRight = useCallback(() => {
    // Se o menu estiver aberto e estiver no header, fecha o menu e volta para a seção anterior
    if (menuIsOpen && focusedSection === 0) {
      if (onCloseMenu) {
        onCloseMenu()
        // Volta para a seção que estava antes
        setFocusedSection(previousSectionRef.current)
        setFocusedItem(0)
      }
    }
    // Navegação horizontal na seção de programas
    else if (currentSection === 'programs') {
      setFocusedItem((currentItem) => {
        const newItem = currentItem + 1
        return newItem < itemsInProgramsSection ? newItem : itemsInProgramsSection - 1
      })
    }
  }, [currentSection, itemsInProgramsSection, menuIsOpen, focusedSection, onCloseMenu])

  const handleEnter = useCallback(() => {
    if (onEnter) {
      // Se estiver na barra lateral (menu aberto), navega para a seção correspondente
      if (menuIsOpen && focusedSection === 0) {
        // Mapeia o item do menu para a seção correspondente
        // 0 = Ao Vivo (header/home - já está aqui, mas pode navegar para a página)
        // 1 = Programas (redireciona para /programs)
        // Todos os itens do menu redirecionam para suas páginas
        onEnter(currentSection, focusedMenuItem)
        // Fecha o menu após navegar
        if (onCloseMenu) onCloseMenu()
      } else if (currentSection === 'programs') {
        onEnter(currentSection, focusedItem)
      } else if (currentSection === 'header') {
        onEnter(currentSection, focusedMenuItem)
      } else {
        onEnter(currentSection)
      }
    }
  }, [onEnter, currentSection, focusedItem, focusedMenuItem, menuIsOpen, focusedSection, onCloseMenu])

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
        // Escape será tratado no componente que usa o hook
        break
      default:
        break
    }
  }, [isActive, moveUp, moveDown, moveLeft, moveRight, handleEnter])

  useEffect(() => {
    if (isActive) {
      window.addEventListener('keydown', onKeyDown)
      return () => {
        window.removeEventListener('keydown', onKeyDown)
      }
    }
  }, [isActive, onKeyDown])

  // Reset focused item quando muda de seção
  useEffect(() => {
    if (currentSection === 'programs') {
      if (focusedItem >= itemsInProgramsSection && itemsInProgramsSection > 0) {
        setFocusedItem(itemsInProgramsSection - 1)
      }
    } else if (currentSection === 'header') {
      if (focusedMenuItem >= menuItemsCount && menuItemsCount > 0) {
        setFocusedMenuItem(menuItemsCount - 1)
      }
    } else {
      setFocusedItem(0)
      setFocusedMenuItem(0)
    }
  }, [currentSection, itemsInProgramsSection, focusedItem, menuItemsCount, focusedMenuItem])

  return { 
    focusedSection, 
    focusedItem,
    focusedMenuItem,
    setFocusedSection,
    setFocusedItem,
    setFocusedMenuItem,
    currentSection,
    previousSectionRef
  }
}

export default useVerticalNavigation

