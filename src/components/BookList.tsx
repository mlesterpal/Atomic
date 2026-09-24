import { Badge, Box, Flex, Grid, Icon, IconButton, Stack, Text, type GridProps } from "@chakra-ui/react"
import { useState } from "react"
import { FaEllipsisH } from "react-icons/fa"
import { Link } from "react-router-dom"

export type BookListBook = {
  id: number
  title: string
  author: string
  finished?: boolean
}

type BookListProps = {
  books: BookListBook[]
  basePath?: string
  templateColumns?: GridProps["templateColumns"]
  onDeleteBook?: (bookId: number) => void
  onToggleFinished?: (bookId: number, finished: boolean) => void
}

const BookList = ({
  books,
  basePath = "/reading",
  templateColumns,
  onDeleteBook,
  onToggleFinished,
}: BookListProps) => {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null)

  return (
    <Grid
      templateColumns={templateColumns ?? { base: "1fr", md: "repeat(3, 1fr)" }}
      gap={4}
      onMouseDown={() => setOpenMenuId(null)}
    >
      {books.map((book) => (
        <Box
          key={book.id}
          p={5}
          borderWidth="1px"
          borderRadius="xl"
          bg={book.finished ? "bg.muted" : "bg.panel"}
          opacity={book.finished ? 0.85 : 1}
          borderColor={book.finished ? "green.400" : undefined}
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
          <Flex justify="space-between" align="flex-start" gap={3}>
            <Box minW={0} flex="1">
              <Link to={`${basePath}/${book.id}`}>
                <Text
                  fontWeight="semibold"
                  fontSize="lg"
                  letterSpacing="-0.02em"
                  textDecoration={book.finished ? "line-through" : undefined}
                >
                  {book.title}
                </Text>
                <Text color="fg.muted" fontSize="sm" mt={1}>
                  {book.author}
                </Text>
              </Link>

              {book.finished && (
                <Badge mt={3} variant="subtle" borderRadius="md" px={2} py={1}>
                  Finished
                </Badge>
              )}
            </Box>

            <Box position="relative" onMouseDown={(e) => e.stopPropagation()}>
              <IconButton
                aria-label="Book actions"
                variant="ghost"
                size="sm"
                color="fg.muted"
                onClick={() => setOpenMenuId((prev) => (prev === book.id ? null : book.id))}
              >
                <Icon as={FaEllipsisH} boxSize={4} />
              </IconButton>

              {openMenuId === book.id && (
                <Box
                  position="absolute"
                  top="9"
                  right="0"
                  minW="44"
                  borderWidth="1px"
                  borderRadius="xl"
                  bg="bg.panel"
                  p={2}
                  boxShadow="lg"
                  zIndex="popover"
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <Stack gap={1}>
                    <Box
                      as="button"
                      onClick={() => {
                        onDeleteBook?.(book.id)
                        setOpenMenuId(null)
                      }}
                      textAlign="left"
                      borderRadius="md"
                      _hover={{ bg: "bg.muted" }}
                      px={2}
                      py={2}
                    >
                      <Text>Delete</Text>
                    </Box>

                    <Box
                      as="button"
                      onClick={() => {
                        onToggleFinished?.(book.id, !book.finished)
                        setOpenMenuId(null)
                      }}
                      textAlign="left"
                      borderRadius="md"
                      _hover={{ bg: "bg.muted" }}
                      px={2}
                      py={2}
                    >
                      <Text>{book.finished ? "Mark as unfinished" : "Set as finished"}</Text>
                    </Box>
                  </Stack>
                </Box>
              )}
            </Box>
          </Flex>
        </Box>
      ))}
    </Grid>
  )
}

export default BookList
