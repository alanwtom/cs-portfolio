import { useEffect } from "react"

interface KeyboardShortcutOptions {
  onEscapePress: () => void
}

// Cmd/Ctrl+L used to toggle the theme from here. There is only one theme
// now, and that shortcut is the browser's own (focus the address bar), so
// taking it back was never a good trade.
export function useKeyboardShortcuts({
  onEscapePress,
}: KeyboardShortcutOptions) {
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
