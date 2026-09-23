import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Grid,
  Heading,
  HStack,
  Input,
  Stack,
  Textarea,
  Text,
} from "@chakra-ui/react"
import { useEffect, useMemo, useState } from "react"
import PageHeading from "../components/PageHeading"

type SpiritualCategory = "Spiritual Gems" | "CBS" | "Living as Christians" | "Watchtower Study"

type SpiritualNote = {
  id: string
  dateISO: string // YYYY-MM-DD
  category: SpiritualCategory
  type: string
  notes: string
}

const categoryChips: SpiritualCategory[] = [
  "Spiritual Gems",
  "CBS",
  "Living as Christians",
  "Watchtower Study",
]

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

const initialNotes: SpiritualNote[] = [
  // Sep 23
  {
    id: "2026-09-23-gems-1",
    dateISO: "2026-09-23",
    category: "Spiritual Gems",
    type: "Exodus 3:14 — “I Will Become”",
    notes: "Jehovah’s name highlights purposeful action. Trust that he becomes what is needed to fulfill his promises.",
  },
  {
    id: "2026-09-23-cbs-1",
    dateISO: "2026-09-23",
    category: "CBS",
    type: "CBS paragraph 6",
    notes: "Key point: listening with empathy helps build trust and makes counsel easier to accept.",
  },

  // Sep 22
  {
    id: "2026-09-22-lac-1",
    dateISO: "2026-09-22",
    category: "Living as Christians",
    type: "Apply yourself — ministry tip",
    notes: "Keep introductions simple. Ask one clear question and pause—let the person speak.",
  },
  {
    id: "2026-09-22-wt-1",
    dateISO: "2026-09-22",
    category: "Watchtower Study",
    type: "WT paragraph 10",
    notes: "Real humility shows in small choices: giving others credit, being quick to apologize, and accepting direction.",
  },

  // Sep 21
  {
    id: "2026-09-21-gems-1",
    dateISO: "2026-09-21",
    category: "Spiritual Gems",
    type: "Genesis 39:9 — integrity",
    notes: "Integrity is decided before the temptation comes. Plan boundaries ahead of time.",
  },

  // Older dates (should only appear when a specific category is selected)
  {
    id: "2026-09-18-wt-1",
    dateISO: "2026-09-18",
    category: "Watchtower Study",
    type: "WT paragraph 3",
    notes: "Jehovah’s patience invites repentance—imitate him by being slow to judge and quick to forgive.",
  },
  {
    id: "2026-09-15-cbs-1",
    dateISO: "2026-09-15",
    category: "CBS",
    type: "CBS review question",
    notes: "Ask: What is the main lesson? How can I apply it this week in speech or attitude?",
  },
]

const SpiritualPage = () => {
  const [notes, setNotes] = useState<SpiritualNote[]>(() => initialNotes)

  const allDatesNewestFirst = useMemo(() => {
    return Array.from(new Set(notes.map((n) => n.dateISO))).sort((a, b) => b.localeCompare(a))
  }, [notes])

  const mostRecent3Days = useMemo(() => allDatesNewestFirst.slice(0, 3), [allDatesNewestFirst])

  const [query, setQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<SpiritualCategory | "All">("All")

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [draftDateISO, setDraftDateISO] = useState(() => toISODate(new Date()))
  const [draftCategory, setDraftCategory] = useState<SpiritualCategory>("Spiritual Gems")
  const [draftType, setDraftType] = useState("")
  const [draftNotes, setDraftNotes] = useState("")

  const openCreate = () => {
    setDraftDateISO(toISODate(new Date()))
    setDraftCategory("Spiritual Gems")
    setDraftType("")
    setDraftNotes("")
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
      .filter((n) => (selectedCategory === "All" ? mostRecent3Days.includes(n.dateISO) : true))
      .filter((n) => (selectedCategory === "All" ? true : n.category === selectedCategory))
      .filter((n) => {
        if (!q) return true
        return (
          n.type.toLowerCase().includes(q) ||
          n.notes.toLowerCase().includes(q) ||
          n.category.toLowerCase().includes(q)
        )
      })
  }, [mostRecent3Days, notes, query, selectedCategory])

  const grouped = useMemo(() => {
    const map = new Map<string, SpiritualNote[]>()
    for (const n of filtered) {
      const arr = map.get(n.dateISO) ?? []
      arr.push(n)
      map.set(n.dateISO, arr)
    }

    const dateOrder =
      selectedCategory === "All"
        ? mostRecent3Days
        : Array.from(new Set(filtered.map((n) => n.dateISO))).sort((a, b) => b.localeCompare(a))

    return dateOrder.filter((d) => map.has(d)).map((d) => ({ dateISO: d, notes: map.get(d) ?? [] }))
  }, [filtered, mostRecent3Days, selectedCategory])

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
                New note
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
                  const type = draftType.trim()
                  const notesText = draftNotes.trim()
                  if (!dateISO || !type || !notesText) return

                  const id = `${dateISO}-${draftCategory.replaceAll(" ", "-").toLowerCase()}-${Date.now()}`
                  setNotes((prev) => [
                    {
                      id,
                      dateISO,
                      category: draftCategory,
                      type,
                      notes: notesText,
                    },
                    ...prev,
                  ])
                  closeCreate()
                }}
                disabled={!draftDateISO.trim() || !draftType.trim() || !draftNotes.trim()}
              >
                Create note
              </Button>
            </Flex>
          </Box>
        </Box>
      )}

      <Stack gap={6}>
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
                    <Text
                      color="fg.muted"
                      fontSize="xs"
                      fontWeight="medium"
                      letterSpacing="0.08em"
                    >
                      {n.category.toUpperCase()}
                    </Text>
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
    </Box>
  )
}

export default SpiritualPage

