"use client"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
  isLoaded: boolean
}

const initialState: ThemeProviderState = {
  theme: "dark",
  setTheme: () => null,
  isLoaded: false,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  storageKey = "theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load theme from localStorage on mount (client-side only)
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem(storageKey) as Theme
      if (savedTheme && (savedTheme === "dark" || savedTheme === "light")) {
        setTheme(savedTheme)
      }
    } catch (error) {
      // localStorage might not be available (SSR, private browsing, etc.)
      console.warn("Failed to load theme from localStorage:", error)
    } finally {
      setIsLoaded(true)
    }
  }, [storageKey])

  // Apply theme to document
  useEffect(() => {
    if (!isLoaded) return

    const root = window.document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(theme)
  }, [theme, isLoaded])

  const value = {
    theme,
    isLoaded,
    setTheme: (newTheme: Theme) => {
      try {
        localStorage.setItem(storageKey, newTheme)
      } catch (error) {
        console.warn("Failed to save theme to localStorage:", error)
      }
      setTheme(newTheme)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
