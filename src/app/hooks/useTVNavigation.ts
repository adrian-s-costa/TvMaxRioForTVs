import { useCallback, useEffect, useState, RefObject } from "react"

interface UseTVNavigationProps {
  isActive: boolean
  railsCount: number
  itemsPerRail?: number[]
}

interface UseTVNavigationReturn {
  focusedRail: number
  focusedItem: number
  setFocusedRail: (index: number) => void
  setFocusedItem: (index: number) => void
}

const useTVNavigation = ({ 
  isActive, 
  railsCount,
  itemsPerRail = []
}: UseTVNavigationProps): UseTVNavigationReturn => {
  const [focusedRail, setFocusedRail] = useState(0)
  const [focusedItem, setFocusedItem] = useState(0)

  const moveUp = useCallback(() => {
    setFocusedRail((currentRail) => {
      const newRail = currentRail - 1
      return newRail >= 0 ? newRail : 0
    })
  }, [])

  const moveDown = useCallback(() => {
    setFocusedRail((currentRail) => {
      const newRail = currentRail + 1
      return newRail < railsCount ? newRail : railsCount - 1
    })
  }, [railsCount])

  const moveLeft = useCallback(() => {
    setFocusedItem((currentItem) => {
      const newItem = currentItem - 1
      return newItem >= 0 ? newItem : 0
    })
  }, [])

  const moveRight = useCallback(() => {
    const currentRailItems = itemsPerRail[focusedRail] || 0
    setFocusedItem((currentItem) => {
      const newItem = currentItem + 1
      return newItem < currentRailItems ? newItem : currentRailItems - 1
    })
  }, [focusedRail, itemsPerRail])

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isActive) return

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault()
        moveUp()
        // Reset item index when changing rails
        setFocusedItem(0)
        break
      case 'ArrowDown':
        e.preventDefault()
        moveDown()
        // Reset item index when changing rails
        setFocusedItem(0)
        break
      case 'ArrowLeft':
        e.preventDefault()
        moveLeft()
        break
      case 'ArrowRight':
        e.preventDefault()
        moveRight()
        break
      default:
        break
    }
  }, [isActive, moveUp, moveDown, moveLeft, moveRight])

  useEffect(() => {
    if (isActive) {
      window.addEventListener('keydown', onKeyDown)
      return () => {
        window.removeEventListener('keydown', onKeyDown)
      }
    }
  }, [isActive, onKeyDown])

  // Reset focused item when rail changes
  useEffect(() => {
    const currentRailItems = itemsPerRail[focusedRail] || 0
    if (focusedItem >= currentRailItems && currentRailItems > 0) {
      setFocusedItem(currentRailItems - 1)
    }
  }, [focusedRail, itemsPerRail, focusedItem])

  return { 
    focusedRail, 
    focusedItem,
    setFocusedRail,
    setFocusedItem
  }
}

export default useTVNavigation
