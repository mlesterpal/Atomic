import { Box } from "@chakra-ui/react"
import BookList from "./BookList"
import PageHeading from "./PageHeading"
import { readingBooks } from "./readingMockData"

const ReadingPage = () => {
  return (
    <Box maxW="5xl" mx="auto" px={{ base: 5, md: 8 }} py={{ base: 8, md: 12 }}>
      <PageHeading
        title="Reading"
        description="Track progress and save your favorite lines."
        showBack
      />

      <BookList books={readingBooks} />
    </Box>
  )
}

export default ReadingPage
