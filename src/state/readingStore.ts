import type { BookListBook } from "../components/BookList"
import type { BookNotesQuote } from "../components/BookNotes"
import { readingBooks, readingNotesById } from "../components/readingMockData"

export type ReadingNotes = {
  lastPageRead?: number
  quotes?: BookNotesQuote[]
}

export type ReadingState = {
  books: BookListBook[]
  notesById: Record<number, ReadingNotes>
}

const STORAGE_KEY = "atomic.reading.v1"

const defaultState = (): ReadingState => {
  const notesById: Record<number, ReadingNotes> = {}
  for (const [id, notes] of Object.entries(readingNotesById)) {
    notesById[Number(id)] = { lastPageRead: notes.lastPageRead, quotes: notes.quotes }
  }
  return { books: readingBooks, notesById }
}

export const loadReadingState = (): ReadingState => {
  const fallback = defaultState()
  if (typeof window === "undefined") return fallback

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return fallback

    const parsed = JSON.parse(raw) as Partial<ReadingState> | null
    if (!parsed || !Array.isArray(parsed.books) || typeof parsed.notesById !== "object" || !parsed.notesById) {
      return fallback
    }

    return {
      books: parsed.books as BookListBook[],
      notesById: parsed.notesById as Record<number, ReadingNotes>,
    }
  } catch {
    return fallback
  }
}

export const saveReadingState = (state: ReadingState) => {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // ignore quota / privacy mode errors (non-critical for this app)
  }
}

