import { Box } from "@chakra-ui/react"
import { useMemo } from "react"
import { useParams } from "react-router-dom"
import BookNotes from "./BookNotes"
import PageHeading from "./PageHeading"
import { readingBooks, readingNotesById } from "./readingMockData"

const BookNotesPage = () => {
  const { bookId } = useParams()
  const id = useMemo(() => Number(bookId), [bookId])

  const book = useMemo(() => readingBooks.find((b) => b.id === id), [id])
  const notes = useMemo(() => (Number.isFinite(id) ? readingNotesById[id] : undefined), [id])

  return (
    <Box maxW="5xl" mx="auto" px={{ base: 5, md: 8 }} py={{ base: 8, md: 12 }}>
      <PageHeading
        title={book ? `${book.title} notes` : "Book notes"}
        description={book ? "Last page read and favorite lines (static preview)." : undefined}
        showBack
      />

      <BookNotes book={book} lastPageRead={notes?.lastPageRead} quotes={notes?.quotes} />
    </Box>
  )
}

export default BookNotesPage

