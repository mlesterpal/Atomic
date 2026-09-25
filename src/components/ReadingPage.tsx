import { Box, Button, Flex, Heading, Input, Stack, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import BookList from "./BookList"
import PageHeading from "./PageHeading"
import { useAddBook, useDeleteBook, useGetAllBooks, useToggleFinished } from "../hooks/bookRepository"

const ReadingPage = () => {
  const booksQuery = useGetAllBooks()
  const addBookMutation = useAddBook()
  const deleteBookMutation = useDeleteBook()
  const toggleFinishedMutation = useToggleFinished()

  const books = booksQuery.data ?? []

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [draftTitle, setDraftTitle] = useState("")
  const [draftAuthor, setDraftAuthor] = useState("")

  const openCreate = () => {
    setDraftTitle("")
    setDraftAuthor("")
    setIsCreateOpen(true)
  }

  const closeCreate = () => setIsCreateOpen(false)

  useEffect(() => {
    if (!isCreateOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCreate()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [isCreateOpen])

  return (
    <Box maxW="5xl" mx="auto" px={{ base: 5, md: 8 }} py={{ base: 8, md: 12 }}>
      <PageHeading
        title="Reading"
        description="Track progress and save your favorite lines."
        showBack
      />

      <Flex justify="space-between" align="center" gap={4} mb={6} flexWrap="wrap">
        <Text color="fg.muted" fontSize="sm">
          {books.length} book{books.length === 1 ? "" : "s"}
        </Text>
        <Button size="sm" onClick={openCreate}>
          Add book
        </Button>
      </Flex>

      {booksQuery.isLoading && (
        <Box borderWidth="1px" borderRadius="2xl" bg="bg.panel" p={6} mb={6}>
          <Heading size="md" letterSpacing="-0.02em">
            Loading…
          </Heading>
          <Text color="fg.muted" mt={2}>
            Fetching books from the API.
          </Text>
        </Box>
      )}

      {booksQuery.isError && (
        <Box borderWidth="1px" borderRadius="2xl" bg="bg.panel" p={6} mb={6}>
          <Heading size="md" letterSpacing="-0.02em">
            Couldn’t load books
          </Heading>
          <Text color="fg.muted" mt={2}>
            {String(booksQuery.error)}
          </Text>
        </Box>
      )}

      {isCreateOpen && (
        <Box
          position="fixed"
          inset="0"
          zIndex="overlay"
          bg="blackAlpha.600"
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={4}
          onMouseDown={(e) => {
            if (e.currentTarget === e.target) closeCreate()
          }}
        >
          <Box
            role="dialog"
            aria-modal="true"
            w="full"
            maxW="lg"
            borderWidth="1px"
            borderRadius="2xl"
            bg="bg.panel"
            p={6}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <Flex justify="space-between" align="center" gap={4}>
              <Heading size="md" letterSpacing="-0.02em">
                New book
              </Heading>
              <Button variant="ghost" onClick={closeCreate}>
                Close
              </Button>
            </Flex>

            <Stack gap={4} mt={5}>
              <Box>
                <Text color="fg.muted" fontSize="xs" fontWeight="medium" letterSpacing="0.08em">
                  TITLE
                </Text>
                <Input
                  mt={2}
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                  placeholder="e.g. The Bible"
                  bg="bg.muted"
                  borderRadius="xl"
                />
              </Box>

              <Box>
                <Text color="fg.muted" fontSize="xs" fontWeight="medium" letterSpacing="0.08em">
                  AUTHOR
                </Text>
                <Input
                  mt={2}
                  value={draftAuthor}
                  onChange={(e) => setDraftAuthor(e.target.value)}
                  placeholder="e.g. Various"
                  bg="bg.muted"
                  borderRadius="xl"
                />
              </Box>
            </Stack>

            <Flex mt={6} justify="flex-end" gap={3} flexWrap="wrap">
              <Button variant="outline" onClick={closeCreate}>
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  const title = draftTitle.trim()
                  const author = draftAuthor.trim()
                  if (!title || !author) return

                  await addBookMutation.mutateAsync({ title, author })
                  closeCreate()
                }}
                disabled={!draftTitle.trim() || !draftAuthor.trim()}
              >
                Create book
              </Button>
            </Flex>
          </Box>
        </Box>
      )}

      <BookList
        books={books}
        onDeleteBook={deleteBookMutation.mutate}
        onToggleFinished={toggleFinishedMutation.mutate}
      />
    </Box>
  )
}
export default ReadingPage
