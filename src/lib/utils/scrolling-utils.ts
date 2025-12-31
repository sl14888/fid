export const scrollIntoView = (ref?: React.RefObject<HTMLElement>) => {
  if (ref?.current && ref.current.scrollIntoView) {
    ref.current.scrollIntoView({ behavior: 'smooth' })
  } else {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }
}
