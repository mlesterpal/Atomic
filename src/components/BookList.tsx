import { Box, Grid, Text, type GridProps } from "@chakra-ui/react"
import { Link } from "react-router-dom"

export type BookListBook = {
  id: number
  title: string
  author: string
}

type BookListProps = {
  books: BookListBook[]
  basePath?: string
  templateColumns?: GridProps["templateColumns"]
}

const BookList = ({ books, basePath = "/reading", templateColumns }: BookListProps) => {
  return (
    <Grid
      templateColumns={templateColumns ?? { base: "1fr", md: "repeat(3, 1fr)" }}
      gap={4}
    >
      {books.map((book) => (
        <Box
          key={book.id}
          p={5}
          borderWidth="1px"
          borderRadius="xl"
          bg="bg.panel"
          asChild
          transition="border-color 0.15s ease, transform 0.15s ease"
          _hover={{
            borderColor: "fg.muted",
            transform: "translateY(-2px)",
          }}
          _focusVisible={{
            outline: "2px solid",
            outlineColor: "fg.muted",
            outlineOffset: "2px",
          }}
        >
          <Link to={`${basePath}/${book.id}`}>
            <Text fontWeight="semibold" fontSize="lg" letterSpacing="-0.02em">
              {book.title}
            </Text>
            <Text color="fg.muted" fontSize="sm" mt={1}>
              {book.author}
            </Text>
          </Link>
        </Box>
      ))}
    </Grid>
  )
}

export default BookList
