import { Box } from "@chakra-ui/react"
import { useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import BookNotes from "./BookNotes"
import PageHeading from "./PageHeading"
import { loadReadingState, saveReadingState, type ReadingNotes, type ReadingState } from "../state/readingStore"

const BookNotesPage = () => {
  const { bookId } = useParams()
  const id = useMemo(() => Number(bookId), [bookId])

  const [readingState, setReadingState] = useState<ReadingState>(() => loadReadingState())

  // Refresh from storage when this page mounts (covers newly-added books).
  useEffect(() => {
    setReadingState(loadReadingState())
  }, [])

  const book = useMemo(() => readingState.books.find((b) => b.id === id), [id, readingState.books])
  const notes = useMemo<ReadingNotes | undefined>(
    () => (Number.isFinite(id) ? readingState.notesById[id] : undefined),
    [id, readingState.notesById]
  )

  return (
    <Box maxW="5xl" mx="auto" px={{ base: 5, md: 8 }} py={{ base: 8, md: 12 }}>
      <PageHeading
        title={book ? `${book.title} notes` : "Book notes"}
        description={book ? "Last page read and favorite lines (static preview)." : undefined}
        showBack
      />

      <BookNotes
        book={book}
        lastPageRead={notes?.lastPageRead}
        quotes={notes?.quotes}
        onUpdateLastPageRead={(value) => {
          if (!Number.isFinite(id)) return
          const next: ReadingState = {
            ...readingState,
            notesById: {
              ...readingState.notesById,
              [id]: {
                ...(readingState.notesById[id] ?? {}),
                lastPageRead: value,
              },
            },
          }
          setReadingState(next)
          saveReadingState(next)
        }}
        onAddQuote={(quote) => {
          if (!Number.isFinite(id)) return
          const prevNotes = readingState.notesById[id] ?? {}
          const prevQuotes = prevNotes.quotes ?? []
          const next: ReadingState = {
            ...readingState,
            notesById: {
              ...readingState.notesById,
              [id]: {
                ...prevNotes,
                quotes: [quote, ...prevQuotes],
              },
            },
          }
          setReadingState(next)
          saveReadingState(next)
        }}
        onDeleteQuote={(quoteId) => {
          if (!Number.isFinite(id)) return
          const prevNotes = readingState.notesById[id] ?? {}
          const prevQuotes = prevNotes.quotes ?? []
          const next: ReadingState = {
            ...readingState,
            notesById: {
              ...readingState.notesById,
              [id]: {
                ...prevNotes,
                quotes: prevQuotes.filter((q) => q.id !== quoteId),
              },
            },
          }
          setReadingState(next)
          saveReadingState(next)
        }}
        onToggleQuoteFavorite={(quoteId, favorite) => {
          if (!Number.isFinite(id)) return
          const prevNotes = readingState.notesById[id] ?? {}
          const prevQuotes = prevNotes.quotes ?? []
          const next: ReadingState = {
            ...readingState,
            notesById: {
              ...readingState.notesById,
              [id]: {
                ...prevNotes,
                quotes: prevQuotes.map((q) => (q.id === quoteId ? { ...q, favorite } : q)),
              },
            },
          }
          setReadingState(next)
          saveReadingState(next)
        }}
      />
    </Box>
  )
}

export default BookNotesPage

