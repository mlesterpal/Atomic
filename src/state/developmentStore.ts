export type DevHoursData = Record<string, number> // YYYY-MM-DD -> hours

const STORAGE_KEY = "atomic.development.v1"

export const loadDevHoursData = (): DevHoursData => {
  if (typeof window === "undefined") return {}
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== "object") return {}
    return parsed as DevHoursData
  } catch {
    return {}
  }
}

export const saveDevHoursData = (data: DevHoursData) => {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // ignore quota / privacy mode errors
  }
}

