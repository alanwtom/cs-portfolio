import { useEffect } from "react"

interface KeyboardShortcutOptions {
  onThemeToggle: () => void
  onEscapePress: () => void
}

export function useKeyboardShortcuts({
  onThemeToggle,
  onEscapePress,
}: KeyboardShortcutOptions) {

  // Theme toggle shortcut (Cmd/Ctrl + L)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "l") {
        e.preventDefault()
        onThemeToggle()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onThemeToggle])

  // Escape key handler
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onEscapePress()
        // Remove focus from any focused element to prevent outline
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur()
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onEscapePress])
}
