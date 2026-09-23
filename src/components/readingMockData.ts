import type { BookListBook } from "./BookList"
import type { BookNotesQuote } from "./BookNotes"

export type NotesPreview = {
  lastPageRead: number
  quotes: BookNotesQuote[]
}

export const readingBooks: BookListBook[] = [
  { id: 1, title: "Atomic Habits", author: "James Clear" },
  { id: 2, title: "The Power of Habit", author: "Charles Duhigg" },
  { id: 3, title: "The 48 Laws of Power", author: "Robert Greene" },
]

export const readingNotesById: Record<number, NotesPreview> = {
  1: {
    lastPageRead: 42,
    quotes: [
      {
        id: "ah-q1",
        text: "You do not rise to the level of your goals. You fall to the level of your systems.",
        page: 27,
        favorite: true,
      },
      {
        id: "ah-q2",
        text: "Every action you take is a vote for the type of person you wish to become.",
        page: 37,
      },
      {
        id: "ah-q3",
        text: "Habits are the compound interest of self-improvement.",
        page: 16,
      },
    ],
  },
  2: {
    lastPageRead: 18,
    quotes: [
      {
        id: "poh-q1",
        text: "Once we understand that habits can change, we have the freedom — and the responsibility — to remake them.",
        page: 30,
        favorite: true,
      },
    ],
  },
  3: {
    lastPageRead: 9,
    quotes: [],
  },
}

