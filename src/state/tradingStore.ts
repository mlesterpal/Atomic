export type TradingData = Record<string, boolean> // YYYY-MM-DD -> traded?

const STORAGE_KEY = "atomic.trading.v1"

export const loadTradingData = (): TradingData => {
  if (typeof window === "undefined") return {}
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== "object") return {}
    return parsed as TradingData
  } catch {
    return {}
  }
}

export const saveTradingData = (data: TradingData) => {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // ignore quota / privacy mode errors
  }
}

