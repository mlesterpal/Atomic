"use client"

import type { IconButtonProps, SpanProps } from "@chakra-ui/react"
import { ClientOnly, IconButton, Skeleton, Span } from "@chakra-ui/react"
import type { ThemeProviderProps } from "next-themes"
import * as React from "react"
import { LuMoon, LuSun } from "react-icons/lu"

export interface ColorModeProviderProps extends ThemeProviderProps {}

export type ColorMode = "light" | "dark"

export interface UseColorModeReturn {
  colorMode: ColorMode
  setColorMode: (colorMode: ColorMode) => void
  toggleColorMode: () => void
}

const ColorModeContext = React.createContext<UseColorModeReturn | null>(null)
const STORAGE_KEY = "theme"

function getSystemTheme(): ColorMode {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light"
}

function readStoredTheme(storageKey: string, fallback: string): string {
  try {
    return localStorage.getItem(storageKey) || fallback
  } catch {
    return fallback
  }
}

function resolveTheme(theme: string): ColorMode {
  return theme === "light" || theme === "dark" ? theme : getSystemTheme()
}

function applyTheme(theme: ColorMode) {
  const root = document.documentElement
  root.classList.remove("light", "dark")
  root.classList.add(theme)
  root.style.colorScheme = theme
}

export function ColorModeProvider(props: ColorModeProviderProps) {
  const { children, defaultTheme = "system", storageKey = STORAGE_KEY } = props
  const [theme, setThemeState] = React.useState(() =>
    typeof window === "undefined"
      ? defaultTheme
      : readStoredTheme(storageKey, defaultTheme),
  )

  const colorMode = resolveTheme(theme)

  React.useLayoutEffect(() => {
    applyTheme(colorMode)
  }, [colorMode])

  const setColorMode = React.useCallback(
    (next: ColorMode) => {
      setThemeState(next)
      try {
        localStorage.setItem(storageKey, next)
      } catch {
        // ignore write failures (private mode, disabled storage)
      }
    },
    [storageKey],
  )

  const toggleColorMode = React.useCallback(() => {
    setColorMode(colorMode === "dark" ? "light" : "dark")
  }, [colorMode, setColorMode])

  const value = React.useMemo(
    () => ({ colorMode, setColorMode, toggleColorMode }),
    [colorMode, setColorMode, toggleColorMode],
  )

  return (
    <ColorModeContext.Provider value={value}>{children}</ColorModeContext.Provider>
  )
}

export function useColorMode(): UseColorModeReturn {
  const context = React.useContext(ColorModeContext)
  if (!context) {
    throw new Error("useColorMode must be used within ColorModeProvider")
  }
  return context
}

export function useColorModeValue<T>(light: T, dark: T) {
  const { colorMode } = useColorMode()
  return colorMode === "dark" ? dark : light
}

export function ColorModeIcon() {
  const { colorMode } = useColorMode()
  return colorMode === "dark" ? <LuMoon /> : <LuSun />
}

interface ColorModeButtonProps extends Omit<IconButtonProps, "aria-label"> {}

export const ColorModeButton = React.forwardRef<
  HTMLButtonElement,
  ColorModeButtonProps
>(function ColorModeButton(props, ref) {
  const { toggleColorMode } = useColorMode()
  return (
    <ClientOnly fallback={<Skeleton boxSize="9" />}>
      <IconButton
        onClick={toggleColorMode}
        variant="ghost"
        aria-label="Toggle color mode"
        size="sm"
        ref={ref}
        {...props}
        css={{
          _icon: {
            width: "5",
            height: "5",
          },
        }}
      >
        <ColorModeIcon />
      </IconButton>
    </ClientOnly>
  )
})

export const LightMode = React.forwardRef<HTMLSpanElement, SpanProps>(
  function LightMode(props, ref) {
    return (
      <Span
        color="fg"
        display="contents"
        className="chakra-theme light"
        colorPalette="gray"
        colorScheme="light"
        ref={ref}
        {...props}
      />
    )
  },
)

export const DarkMode = React.forwardRef<HTMLSpanElement, SpanProps>(
  function DarkMode(props, ref) {
    return (
      <Span
        color="fg"
        display="contents"
        className="chakra-theme dark"
        colorPalette="gray"
        colorScheme="dark"
        ref={ref}
        {...props}
      />
    )
  },
)
