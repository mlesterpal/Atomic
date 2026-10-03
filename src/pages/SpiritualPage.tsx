import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Grid,
  Heading,
  HStack,
  Icon,
  IconButton,
  Input,
  Stack,
  Textarea,
  Text,
} from "@chakra-ui/react"
import { useEffect, useMemo, useState } from "react"
import { FaEllipsisH } from "react-icons/fa"
import PageHeading from "../components/PageHeading"
import { useGetAllSpiritualCategories } from "../hooks/spiritualRepository"
import { useInfiniteSpiritualNotesByCategory } from "../hooks/spiritualRepository"
import { useDeleteSpiritualNote } from "../hooks/spiritualRepository"
import { useAddSpiritualNote } from "../hooks/spiritualRepository"
import { useUpdateSpiritualNote } from "../hooks/spiritualRepository"

type SpiritualNote = {
  id: string
  dateISO: string // YYYY-MM-DD
  category: string
  type: string
  notes: string
}

const pad2 = (n: number) => String(n).padStart(2, "0")

const toISODate = (d: Date) => {
  const yyyy = d.getFullYear()
  const mm = pad2(d.getMonth() + 1)
  const dd = pad2(d.getDate())
  return `${yyyy}-${mm}-${dd}`
}

const formatDateHeading = (iso: string) => {
  const d = new Date(`${iso}T00:00:00`)
  return new Intl.DateTimeFormat(undefined, {
    month: "long",
    day: "2-digit",
  }).format(d)
}

const SpiritualPage = () => {
  const categoriesQuery = useGetAllSpiritualCategories()
  const categoryChips = useMemo(
    () => (categoriesQuery.data ?? []).map((c) => c.name),
    [categoriesQuery.data]
  )

  const [notes, setNotes] = useState<SpiritualNote[]>([])

  const allDatesNewestFirst = useMemo(() => {
    return Array.from(new Set(notes.map((n) => n.dateISO))).sort((a, b) => b.localeCompare(a))
  }, [notes])

  const [query, setQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | "All">("All")
  const [openNoteMenuId, setOpenNoteMenuId] = useState<string | null>(null)

  const selectedCategoryId = useMemo(() => {
    if (selectedCategory === "All") return null
    const match = (categoriesQuery.data ?? []).find((c) => c.name === selectedCategory)
    return match?.id ?? null
  }, [categoriesQuery.data, selectedCategory])

  const notesQuery = useInfiniteSpiritualNotesByCategory(selectedCategoryId)
  const deleteNoteMutation = useDeleteSpiritualNote()
  const addNoteMutation = useAddSpiritualNote()
  const updateNoteMutation = useUpdateSpiritualNote()

  useEffect(() => {
    const rows = notesQuery.data?.pages.flat() ?? null
    if (!rows) return
    const mapped: SpiritualNote[] = rows.map((r) => ({
      id: `${r.noteId}`,
      dateISO: r.noteDate.slice(0, 10),
      category: r.categoryName,
      type: r.title,
      notes: r.notes ?? "",
    }))
    setNotes(mapped)
  }, [notesQuery.data])

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
  const [draftDateISO, setDraftDateISO] = useState(() => toISODate(new Date()))
  const [draftCategory, setDraftCategory] = useState<string>("")
  const [draftType, setDraftType] = useState("")
  const [draftNotes, setDraftNotes] = useState("")

  const openCreate = () => {
    setEditingNoteId(null)
    setDraftDateISO(toISODate(new Date()))
    setDraftCategory(categoryChips[0] ?? "")
    setDraftType("")
    setDraftNotes("")
    setIsCreateOpen(true)
  }

  const openEdit = (n: SpiritualNote) => {
    setEditingNoteId(n.id)
    setDraftDateISO(n.dateISO)
    setDraftCategory(n.category)
    setDraftType(n.type)
    setDraftNotes(n.notes)
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

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return notes
      .filter((n) => {
        if (!q) return true
        return (
          n.type.toLowerCase().includes(q) ||
          n.notes.toLowerCase().includes(q) ||
          n.category.toLowerCase().includes(q)
        )
      })
  }, [notes, query])

  const grouped = useMemo(() => {
    const map = new Map<string, SpiritualNote[]>()
    for (const n of filtered) {
      const arr = map.get(n.dateISO) ?? []
      arr.push(n)
      map.set(n.dateISO, arr)
    }

    const dateOrder = allDatesNewestFirst

    return dateOrder.filter((d) => map.has(d)).map((d) => ({ dateISO: d, notes: map.get(d) ?? [] }))
  }, [allDatesNewestFirst, filtered])

  return (
    <Box maxW="5xl" mx="auto" px={{ base: 5, md: 8 }} py={{ base: 8, md: 12 }}>
      <PageHeading
        title="Spiritual"
        description="Search and filter your notes (static preview)."
        showBack
      />

      <Stack gap={4} mb={6}>
        <Box>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search notes…"
            bg="bg.panel"
            borderRadius="xl"
          />
        </Box>

        <Flex justify="space-between" align="center" gap={3} flexWrap="wrap">
          <ButtonGroup size="sm" variant="outline" flexWrap="wrap" gap={2}>
            <Button
              onClick={() => setSelectedCategory("All")}
              bg={selectedCategory === "All" ? "bg.muted" : "transparent"}
              borderColor={selectedCategory === "All" ? "fg.muted" : undefined}
            >
              All
            </Button>
            {categoryChips.map((c) => (
              <Button
                key={c}
                onClick={() => setSelectedCategory(c)}
                bg={selectedCategory === c ? "bg.muted" : "transparent"}
                borderColor={selectedCategory === c ? "fg.muted" : undefined}
              >
                {c}
              </Button>
            ))}
          </ButtonGroup>

          <HStack gap={3}>
            <Text color="fg.muted" fontSize="sm">
              {filtered.length} note{filtered.length === 1 ? "" : "s"}
            </Text>
            <Button size="sm" onClick={openCreate}>
              Add note
            </Button>
          </HStack>
        </Flex>
      </Stack>

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
                {editingNoteId ? "Edit note" : "New note"}
              </Heading>
              <Button variant="ghost" onClick={closeCreate}>
                Close
              </Button>
            </Flex>

            <Stack gap={4} mt={5}>
              <Box>
                <Text color="fg.muted" fontSize="xs" fontWeight="medium" letterSpacing="0.08em">
                  DATE
                </Text>
                <Input
                  mt={2}
                  type="date"
                  value={draftDateISO}
                  onChange={(e) => setDraftDateISO(e.target.value)}
                  bg="bg.muted"
                  borderRadius="xl"
                />
              </Box>

              <Box>
                <Text color="fg.muted" fontSize="xs" fontWeight="medium" letterSpacing="0.08em">
                  CATEGORY
                </Text>
                <ButtonGroup mt={2} size="sm" variant="outline" flexWrap="wrap" gap={2}>
                  {categoryChips.map((c) => (
                    <Button
                      key={c}
                      onClick={() => setDraftCategory(c)}
                      bg={draftCategory === c ? "bg.muted" : "transparent"}
                      borderColor={draftCategory === c ? "fg.muted" : undefined}
                    >
                      {c}
                    </Button>
                  ))}
                </ButtonGroup>
              </Box>

              <Box>
                <Text color="fg.muted" fontSize="xs" fontWeight="medium" letterSpacing="0.08em">
                  TYPE
                </Text>
                <Input
                  mt={2}
                  value={draftType}
                  onChange={(e) => setDraftType(e.target.value)}
                  placeholder="e.g. CBS paragraph 6"
                  bg="bg.muted"
                  borderRadius="xl"
                />
              </Box>

              <Box>
                <Text color="fg.muted" fontSize="xs" fontWeight="medium" letterSpacing="0.08em">
                  NOTES
                </Text>
                <Textarea
                  mt={2}
                  value={draftNotes}
                  onChange={(e) => setDraftNotes(e.target.value)}
                  placeholder="Write your notes…"
                  bg="bg.muted"
                  borderRadius="xl"
                  resize="vertical"
                  minH="120px"
                />
              </Box>
            </Stack>

            <Flex mt={6} justify="flex-end" gap={3} flexWrap="wrap">
              <Button variant="outline" onClick={closeCreate}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  const dateISO = draftDateISO.trim()
                  const category = draftCategory.trim()
                  const type = draftType.trim()
                  const notesText = draftNotes.trim()
                  if (!dateISO || !category || !type || !notesText) return

                  if (editingNoteId) {
                    const noteId = Number(editingNoteId)
                    if (!Number.isFinite(noteId)) return

                    const cat = (categoriesQuery.data ?? []).find((c) => c.name === category)
                    if (!cat) return

                    updateNoteMutation.mutate({
                      noteId,
                      payload: {
                        categoryId: cat.id,
                        title: type,
                        notes: notesText,
                        createdAt: `${dateISO}T00:00:00`,
                      },
                    })
                    closeCreate()
                    return
                  }

                  // Create (API-backed).
                  const cat = (categoriesQuery.data ?? []).find((c) => c.name === category)
                  if (!cat) return

                  addNoteMutation.mutate({
                    categoryId: cat.id,
                    title: type,
                    notes: notesText,
                    createdAt: `${dateISO}T00:00:00`,
                  })
                  closeCreate()
                }}
                disabled={
                  !draftDateISO.trim() || !draftCategory.trim() || !draftType.trim() || !draftNotes.trim()
                }
              >
                {editingNoteId ? "Save changes" : "Create note"}
              </Button>
            </Flex>
          </Box>
        </Box>
      )}

      <Stack gap={6} onMouseDown={() => setOpenNoteMenuId(null)}>
        {grouped.length === 0 ? (
          <Box borderWidth="1px" borderRadius="2xl" bg="bg.panel" p={6}>
            <Heading size="md" letterSpacing="-0.02em">
              No results
            </Heading>
            <Text color="fg.muted" mt={2}>
              Try a different search term or category.
            </Text>
          </Box>
        ) : (
          grouped.map(({ dateISO, notes: dateNotes }) => (
            <Box key={dateISO}>
              <Text
                color="fg.muted"
                fontSize="xs"
                fontWeight="medium"
                letterSpacing="0.08em"
                mb={3}
              >
                {formatDateHeading(dateISO).toUpperCase()}
              </Text>

              <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
                {dateNotes.map((n) => (
                  <Box
                    key={n.id}
                    borderWidth="1px"
                    borderRadius="2xl"
                    bg="bg.panel"
                    p={5}
                    transition="border-color 0.15s ease, transform 0.15s ease"
                    _hover={{
                      borderColor: "fg.muted",
                      transform: "translateY(-2px)",
                    }}
                  >
                    <Flex justify="space-between" align="start" gap={4}>
                      <Text
                        color="fg.muted"
                        fontSize="xs"
                        fontWeight="medium"
                        letterSpacing="0.08em"
                      >
                        {n.category.toUpperCase()}
                      </Text>

                      <Box position="relative" onMouseDown={(e) => e.stopPropagation()}>
                        <IconButton
                          aria-label="Note actions"
                          variant="ghost"
                          size="sm"
                          color="fg.muted"
                          onClick={() => setOpenNoteMenuId((prev) => (prev === n.id ? null : n.id))}
                        >
                          <Icon as={FaEllipsisH} boxSize={4} />
                        </IconButton>

                        {openNoteMenuId === n.id && (
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
                              <Box
                                as="button"
                                onClick={() => {
                                  openEdit(n)
                                  setOpenNoteMenuId(null)
                                }}
                                textAlign="left"
                                borderRadius="md"
                                _hover={{ bg: "bg.muted" }}
                                px={2}
                                py={2}
                              >
                                <Text>Edit</Text>
                              </Box>
                              <Box
                                as="button"
                                onClick={() => {
                                  const noteId = Number(n.id)
                                  if (!Number.isFinite(noteId)) return
                                  deleteNoteMutation.mutate(noteId)
                                  setOpenNoteMenuId(null)
                                }}
                                textAlign="left"
                                borderRadius="md"
                                _hover={{ bg: "bg.muted" }}
                                px={2}
                                py={2}
                              >
                                <Text>Delete</Text>
                              </Box>
                            </Stack>
                          </Box>
                        )}
                      </Box>
                    </Flex>
                    <Text fontWeight="semibold" fontSize="lg" letterSpacing="-0.02em" mt={2}>
                      {n.type}
                    </Text>
                    <Text color="fg.muted" mt={2} lineHeight="tall">
                      {n.notes}
                    </Text>
                  </Box>
                ))}
              </Grid>
            </Box>
          ))
        )}
      </Stack>

      <Flex mt={8} justify="center">
        <Button
          variant="outline"
          onClick={() => notesQuery.fetchNextPage()}
          loading={notesQuery.isFetchingNextPage}
          disabled={!notesQuery.hasNextPage}
        >
          Load more
        </Button>
      </Flex>
    </Box>
  )
}

export default SpiritualPage

