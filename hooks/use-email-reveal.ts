import { useState, useRef, useEffect } from "react"

interface EmailRevealState {
  isRevealed: boolean
  showCopyBubble: boolean
  copied: boolean
  copyBubbleRef: React.RefObject<HTMLDivElement | null>
}

interface EmailRevealActions {
  handleMouseDown: () => void
  handleMouseUp: () => void
  handleMouseLeave: () => void
  copyToClipboard: () => void
}

export function useEmailReveal(): EmailRevealState & EmailRevealActions {
  const [isRevealed, setIsRevealed] = useState(false)
  const [showCopyBubble, setShowCopyBubble] = useState(false)
  const [copied, setCopied] = useState(false)
  const copyBubbleRef = useRef<HTMLDivElement | null>(null)
  const emailHoldTimeout = useRef<NodeJS.Timeout | null>(null)

  // Handle click outside to close copy bubble
  useEffect(() => {
    if (!showCopyBubble) return

    function handleClick(e: MouseEvent) {
      if (
        copyBubbleRef.current &&
        e.target instanceof Node &&
        !copyBubbleRef.current.contains(e.target as Node)
      ) {
        setShowCopyBubble(false)
      }
    }

    window.addEventListener("mousedown", handleClick)
    return () => window.removeEventListener("mousedown", handleClick)
  }, [showCopyBubble])

  // Reset copied state after delay
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [copied])

  const handleMouseDown = () => {
    emailHoldTimeout.current = setTimeout(() => {
      setIsRevealed(true)
      setShowCopyBubble(true)
    }, 500)
  }

  const handleMouseUp = () => {
    if (emailHoldTimeout.current) {
      clearTimeout(emailHoldTimeout.current)
      emailHoldTimeout.current = null
    }
  }

  const handleMouseLeave = () => {
    if (emailHoldTimeout.current) {
      clearTimeout(emailHoldTimeout.current)
      emailHoldTimeout.current = null
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText("alanwtom@outlook.com")
      setCopied(true)
      setTimeout(() => setShowCopyBubble(false), 1500)
    } catch (err) {
      console.error("Failed to copy email:", err)
    }
  }

  return {
    isRevealed,
    showCopyBubble,
    copied,
    copyBubbleRef,
    handleMouseDown,
    handleMouseUp,
    handleMouseLeave,
    copyToClipboard,
  }
}
