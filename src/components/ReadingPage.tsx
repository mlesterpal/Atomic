import { Box } from "@chakra-ui/react"
import BookList from "./BookList"
import PageHeading from "./PageHeading"

const ReadingPage = () => {
  return (
    <Box maxW="5xl" mx="auto" px={{ base: 5, md: 8 }} py={{ base: 8, md: 12 }}>
      <PageHeading title="Reading" />
      <BookList />
    </Box>
  )
}

export default ReadingPage
