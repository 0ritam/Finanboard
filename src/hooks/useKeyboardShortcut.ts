import { useEffect } from 'react'

export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  options: { ctrl?: boolean; meta?: boolean; shift?: boolean } = {}
) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.key.toLowerCase() === key.toLowerCase() &&
        (!options.ctrl || e.ctrlKey || e.metaKey) &&
        (!options.meta || e.metaKey) &&
        (!options.shift || e.shiftKey)
      ) {
        e.preventDefault()
        callback()
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [key, callback, options.ctrl, options.meta, options.shift])
}