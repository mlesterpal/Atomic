import { Box, Grid, Text } from "@chakra-ui/react"

const BookList = () => {
  const books = [
    {
      id: 1,
      title: "Atomic Habits",
      author: "James Clear",
    },
    {
      id: 2,
      title: "The Power of Habit",
      author: "Charles Duhigg",
    },
    {
      id: 3,
      title: "The 48 Laws of Power",
      author: "Robert Greene",
    },
  ]
  return (
    <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4}>
      {books.map((book) => (
        <Box
          key={book.id}
          p={5}
          borderWidth="1px"
          borderRadius="xl"
          bg="bg.panel"
          transition="border-color 0.15s ease, transform 0.15s ease"
          _hover={{
            borderColor: "fg.muted",
            transform: "translateY(-2px)",
          }}
        >
          <Text fontWeight="semibold" fontSize="lg" letterSpacing="-0.02em">
            {book.title}
          </Text>
          <Text color="fg.muted" fontSize="sm" mt={1}>
            {book.author}
          </Text>
        </Box>
      ))}
    </Grid>
  )
}

export default BookList
