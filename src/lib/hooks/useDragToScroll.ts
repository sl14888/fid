import { useRef, useState, RefObject } from 'react'

interface UseDragToScrollReturn {
  containerRef: RefObject<HTMLDivElement>
  isDragging: boolean
  handleMouseDown: (e: React.MouseEvent) => void
  handleMouseLeave: () => void
  handleMouseUp: () => void
  handleMouseMove: (e: React.MouseEvent) => void
  handleClick: (e: React.MouseEvent, callback?: () => void) => void
}

export const useDragToScroll = (): UseDragToScrollReturn => {
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeftStart, setScrollLeftStart] = useState(0)
  const [dragDistance, setDragDistance] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return

    setIsDragging(true)
    setStartX(e.pageX - containerRef.current.offsetLeft)
    setScrollLeftStart(containerRef.current.scrollLeft)
    setDragDistance(0)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return

    e.preventDefault()
    const x = e.pageX - containerRef.current.offsetLeft
    const walk = (x - startX) * 2

    containerRef.current.scrollLeft = scrollLeftStart - walk
    setDragDistance(Math.abs(walk))
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  const handleClick = (e: React.MouseEvent, callback?: () => void) => {
    if (dragDistance > 5) {
      e.preventDefault()
      e.stopPropagation()
      return
    }

    callback?.()
  }

  return {
    containerRef,
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    handleClick,
  }
}
