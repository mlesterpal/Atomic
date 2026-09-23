import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  HStack,
  Icon,
  IconButton,
  Input,
  Stack,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react"
import { LuBookOpen, LuEllipsisVertical, LuQuote, LuStar } from "react-icons/lu"
import { useEffect, useMemo, useState, type ElementType } from "react"

export type BookNotesBook = {
  id: number
  title: string
  author: string
}

export type BookNotesQuote = {
  id: string
  text: string
  page?: number
  favorite?: boolean
}

type BookNotesProps = {
  book?: BookNotesBook
  lastPageRead?: number
  quotes?: BookNotesQuote[]
}

const formatNumberOrEmpty = (n: number | undefined) => (typeof n === "number" ? `${n}` : "")

const StatCard = ({
  icon,
  label,
  value,
  subValue,
}: {
  icon: ElementType
  label: string
  value: string
  subValue?: string
}) => {
  return (
    <Box
      borderWidth="1px"
      borderRadius="xl"
      bg="bg.muted"
      p={4}
      display="flex"
      gap={3}
      alignItems="flex-start"
      minW={0}
    >
      <Box
        boxSize="10"
        display="flex"
        alignItems="center"
        justifyContent="center"
        borderRadius="lg"
        bg="bg.panel"
        flexShrink={0}
      >
        <Icon as={icon} boxSize={5} />
      </Box>
      <Box minW={0}>
        <Text color="fg.muted" fontSize="xs" fontWeight="medium" letterSpacing="0.08em">
          {label.toUpperCase()}
        </Text>
        <Text fontWeight="semibold" fontSize="lg" letterSpacing="-0.02em" mt={1}>
          {value}
        </Text>
        {subValue && (
          <Text
            color="fg.muted"
            fontSize="sm"
            mt={1}
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
          >
            {subValue}
          </Text>
        )}
      </Box>
    </Box>
  )
}

const BookNotes = ({ book, lastPageRead, quotes = [] }: BookNotesProps) => {
  if (!book) {
    return (
      <Box borderWidth="1px" borderRadius="2xl" bg="bg.panel" p={6}>
        <Heading size="md" letterSpacing="-0.02em">
          Book notes
        </Heading>
        <Text color="fg.muted" mt={2}>
          Click a book card to preview the layout for Last Page Read and your favorite lines.
        </Text>
      </Box>
    )
  }

  const [pageRead, setPageRead] = useState<number | undefined>(lastPageRead)
  const [favoriteLines, setFavoriteLines] = useState<BookNotesQuote[]>(quotes)

  // keep local preview state in sync when switching books
  useEffect(() => {
    setPageRead(lastPageRead)
  }, [lastPageRead])

  useEffect(() => {
    setFavoriteLines(quotes)
  }, [quotes])

  const [isUpdatePageOpen, setIsUpdatePageOpen] = useState(false)
  const [isAddLineOpen, setIsAddLineOpen] = useState(false)
  const [openQuoteMenuId, setOpenQuoteMenuId] = useState<string | null>(null)

  const [draftPageRead, setDraftPageRead] = useState(() => formatNumberOrEmpty(lastPageRead))

  const [draftLineText, setDraftLineText] = useState("")
  const [draftLinePage, setDraftLinePage] = useState("")

  const openUpdatePage = () => {
    setDraftPageRead(formatNumberOrEmpty(pageRead))
    setIsUpdatePageOpen(true)
  }
  const closeUpdatePage = () => setIsUpdatePageOpen(false)

  const openAddLine = () => {
    setDraftLineText("")
    setDraftLinePage("")
    setIsAddLineOpen(true)
  }
  const closeAddLine = () => setIsAddLineOpen(false)

  const anyModalOpen = isUpdatePageOpen || isAddLineOpen
  useEffect(() => {
    if (!anyModalOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return
      closeUpdatePage()
      closeAddLine()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [anyModalOpen])

  const favoriteCount = useMemo(() => favoriteLines.filter((q) => q.favorite).length, [favoriteLines])

  return (
    <Stack gap={5}>
      <Box borderWidth="1px" borderRadius="2xl" bg="bg.panel" p={6}>
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
          <Box position="relative">
            <StatCard
              icon={LuBookOpen}
              label="Last page read"
              value={typeof pageRead === "number" ? `Page ${pageRead}` : "—"}
            />
            <Button
              size="sm"
              variant="outline"
              position="absolute"
              top={3}
              right={3}
              onClick={openUpdatePage}
            >
              Update
            </Button>
          </Box>

          <Box position="relative">
            <StatCard icon={LuQuote} label="Favorite lines" value={`${favoriteCount}`} />
            <Button
              size="sm"
              variant="outline"
              position="absolute"
              top={3}
              right={3}
              onClick={openAddLine}
            >
              Add line
            </Button>
          </Box>
        </Grid>
      </Box>

      <Box borderWidth="1px" borderRadius="2xl" bg="bg.panel" p={6}>
        <Flex justify="space-between" align="baseline" gap={4}>
          <Heading size="md" letterSpacing="-0.02em">
            Favorite lines
          </Heading>
          <Text color="fg.muted" fontSize="sm">
            {favoriteCount} saved
          </Text>
        </Flex>

        {favoriteLines.length === 0 ? (
          <Box mt={4} borderWidth="1px" borderRadius="xl" bg="bg.muted" p={5}>
            <Text fontWeight="semibold">No favorite lines yet</Text>
            <Text color="fg.muted" mt={1}>
              This section will show your saved quotes for the selected book.
            </Text>
          </Box>
        ) : (
          <VStack
            align="stretch"
            gap={3}
            mt={4}
            onMouseDown={() => {
              setOpenQuoteMenuId(null)
            }}
          >
            {favoriteLines.map((q) => (
              <Box
                key={q.id}
                borderWidth="1px"
                borderRadius="xl"
                p={4}
                bg="bg.muted"
                position="relative"
              >
                <Flex justify="space-between" align="center" gap={4}>
                  <HStack gap={2} minW={0}>
                    {q.favorite && <Icon as={LuStar} boxSize={4} color="yellow.400" />}
                    <Text color="fg.muted" fontSize="sm">
                      {typeof q.page === "number" ? `p. ${q.page}` : "—"}
                    </Text>
                  </HStack>
                </Flex>

                <Box position="absolute" top={2} right={2} onMouseDown={(e) => e.stopPropagation()}>
                  <IconButton
                    aria-label="Quote actions"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setOpenQuoteMenuId((prev) => (prev === q.id ? null : q.id))
                    }}
                    color="fg.muted"
                  >
                    <Icon as={LuEllipsisVertical} boxSize={4} />
                  </IconButton>

                  {openQuoteMenuId === q.id && (
                    <Box
                      position="absolute"
                      top="9"
                      right="0"
                      minW="40"
                      borderWidth="1px"
                      borderRadius="xl"
                      bg="bg.panel"
                      p={2}
                      boxShadow="lg"
                      zIndex="popover"
                      onMouseDown={(e) => e.stopPropagation()}
                    >
                      <Stack gap={1}>
                        <Button
                          size="sm"
                          variant="ghost"
                          justifyContent="flex-start"
                          onClick={() => {
                            setFavoriteLines((prev) => prev.filter((x) => x.id !== q.id))
                            setOpenQuoteMenuId(null)
                          }}
                        >
                          Delete
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          justifyContent="flex-start"
                          onClick={() => {
                            setFavoriteLines((prev) =>
                              prev.map((x) => (x.id === q.id ? { ...x, favorite: !x.favorite } : x))
                            )
                            setOpenQuoteMenuId(null)
                          }}
                        >
                          {q.favorite ? "Unmark favorite" : "Mark as favorite"}
                        </Button>
                      </Stack>
                    </Box>
                  )}
                </Box>

                <Text mt={3} fontSize="md" lineHeight="tall">
                  “{q.text}”
                </Text>
              </Box>
            ))}
          </VStack>
        )}
      </Box>

      {isUpdatePageOpen && (
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
            if (e.currentTarget === e.target) closeUpdatePage()
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
                Update last page read
              </Heading>
              <Button variant="ghost" onClick={closeUpdatePage}>
                Close
              </Button>
            </Flex>

            <Stack gap={4} mt={5}>
              <Box>
                <Text color="fg.muted" fontSize="xs" fontWeight="medium" letterSpacing="0.08em">
                  LAST PAGE READ
                </Text>
                <Input
                  mt={2}
                  inputMode="numeric"
                  value={draftPageRead}
                  onChange={(e) => setDraftPageRead(e.target.value)}
                  placeholder="e.g. 42"
                  bg="bg.muted"
                  borderRadius="xl"
                />
              </Box>
            </Stack>

            <Flex mt={6} justify="flex-end" gap={3} flexWrap="wrap">
              <Button variant="outline" onClick={closeUpdatePage}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  const raw = draftPageRead.trim()
                  if (!raw) {
                    setPageRead(undefined)
                    closeUpdatePage()
                    return
                  }
                  const n = Number(raw)
                  if (!Number.isFinite(n) || n <= 0) return
                  setPageRead(Math.floor(n))
                  closeUpdatePage()
                }}
              >
                Save
              </Button>
            </Flex>
          </Box>
        </Box>
      )}

      {isAddLineOpen && (
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
            if (e.currentTarget === e.target) closeAddLine()
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
                Add favorite line
              </Heading>
              <Button variant="ghost" onClick={closeAddLine}>
                Close
              </Button>
            </Flex>

            <Stack gap={4} mt={5}>
              <Box>
                <Text color="fg.muted" fontSize="xs" fontWeight="medium" letterSpacing="0.08em">
                  LINE
                </Text>
                <Textarea
                  mt={2}
                  value={draftLineText}
                  onChange={(e) => setDraftLineText(e.target.value)}
                  placeholder="Write the line you want to save…"
                  bg="bg.muted"
                  borderRadius="xl"
                  resize="vertical"
                  minH="120px"
                />
              </Box>

              <Box>
                <Text color="fg.muted" fontSize="xs" fontWeight="medium" letterSpacing="0.08em">
                  PAGE (OPTIONAL)
                </Text>
                <Input
                  mt={2}
                  inputMode="numeric"
                  value={draftLinePage}
                  onChange={(e) => setDraftLinePage(e.target.value)}
                  placeholder="e.g. 27"
                  bg="bg.muted"
                  borderRadius="xl"
                />
              </Box>
            </Stack>

            <Flex mt={6} justify="flex-end" gap={3} flexWrap="wrap">
              <Button variant="outline" onClick={closeAddLine}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  const text = draftLineText.trim()
                  if (!text) return

                  const pageRaw = draftLinePage.trim()
                  const page = pageRaw ? Number(pageRaw) : undefined
                  if (pageRaw && (!Number.isFinite(page) || (page ?? 0) <= 0)) return

                  setFavoriteLines((prev) => [
                    {
                      id: `line-${Date.now()}`,
                      text,
                      page: typeof page === "number" ? Math.floor(page) : undefined,
                      favorite: true,
                    },
                    ...prev,
                  ])
                  closeAddLine()
                }}
                disabled={!draftLineText.trim()}
              >
                Add
              </Button>
            </Flex>
          </Box>
        </Box>
      )}
    </Stack>
  )
}

export default BookNotes