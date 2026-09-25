import { Box } from "@chakra-ui/react"
import { useMemo } from "react"
import { useParams } from "react-router-dom"
import BookNotes from "./BookNotes"
import PageHeading from "./PageHeading"
import { useGetAllBooks } from "../hooks/bookRepository"

const BookNotesPage = () => {
  const { bookId } = useParams()
  const id = useMemo(() => Number(bookId), [bookId])

  const booksQuery = useGetAllBooks()
  const book = useMemo(() => booksQuery.data?.find((b) => b.id === id), [booksQuery.data, id])

  return (
    <Box maxW="5xl" mx="auto" px={{ base: 5, md: 8 }} py={{ base: 8, md: 12 }}>
      <PageHeading
        title={book ? `${book.title} notes` : "Book notes"}
        description={book ? "Last page read and favorite lines." : undefined}
        showBack
      />

      <BookNotes book={book} />
    </Box>
  )
}

export default BookNotesPage

