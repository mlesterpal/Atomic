import {
  Badge,
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
  Text,
} from "@chakra-ui/react"
import { useEffect, useMemo, useState } from "react"
import { FaEllipsisH } from "react-icons/fa"
import PageHeading from "../components/PageHeading"
import BestExerciseRecord from "../components/BestExerciseRecord"
import {
  useAddExerciseRecord,
  useGetAllExerciseCategories,
  useGetBestLiftsByMuscleGroup,
  useGetRecentExerciseRecords,
} from "../hooks/exerciseRepository"

const KNOWN_CATEGORIES = ["Running", "Bike", "Lifting", "Basketball"] as const
type ExerciseCategory = (typeof KNOWN_CATEGORIES)[number]

const isExerciseCategory = (value: string): value is ExerciseCategory =>
  (KNOWN_CATEGORIES as readonly string[]).includes(value)

type ExerciseRecord = {
  id: string
  dateISO: string // YYYY-MM-DD
  category: ExerciseCategory
  primaryLabel: string // Steps / KM / Body parts / Shots made
  primaryValue: string
  secondaryLabel: string // Time / Weight
  secondaryValue: string
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

const labelsForCategory = (category: ExerciseCategory) => {
  switch (category) {
    case "Running":
      return { primaryLabel: "Steps", secondaryLabel: "Time" }
    case "Bike":
      return { primaryLabel: "KM", secondaryLabel: "Time" }
    case "Lifting":
      return { primaryLabel: "Body parts", secondaryLabel: "Weight" }
    case "Basketball":
      return { primaryLabel: "Shots made", secondaryLabel: "Time" }
  }
}

const ExercisePage = () => {
  const categoriesQuery = useGetAllExerciseCategories()
  const recordsQuery = useGetRecentExerciseRecords()
  const addRecordMutation = useAddExerciseRecord()
  const bestLiftsQuery = useGetBestLiftsByMuscleGroup()
  const categoryChips = useMemo(() => {
    const fromApi = (categoriesQuery.data ?? [])
      .map((c) => c.name)
      .filter((name): name is string => Boolean(name && name.trim()))
      .map((name) => name.trim())
      .filter(isExerciseCategory)

    return fromApi.length ? fromApi : [...KNOWN_CATEGORIES]
  }, [categoriesQuery.data])

  const [records, setRecords] = useState<ExerciseRecord[]>([])

  useEffect(() => {
    const rows = recordsQuery.data
    if (!rows) return
    const mapped: ExerciseRecord[] = rows
      .map((r) => {
        const categoryName = (r.categoryName ?? "").trim()
        if (!isExerciseCategory(categoryName)) return null
        return {
          id: `${r.recordId}`,
          dateISO: r.recordDate.slice(0, 10),
          category: categoryName,
          primaryLabel: r.primaryLabel,
          primaryValue: r.primaryValue,
          secondaryLabel: r.secondaryLabel,
          secondaryValue: r.secondaryValue,
        }
      })
      .filter((x): x is ExerciseRecord => Boolean(x))
    setRecords(mapped)
  }, [recordsQuery.data])

  const mostRecent3Days = useMemo(() => {
    const unique = Array.from(new Set(records.map((r) => r.dateISO))).sort((a, b) =>
      b.localeCompare(a)
    )
    return unique.slice(0, 3)
  }, [records])

  const [query, setQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<ExerciseCategory | "All">("All")

  const [openRecordMenuId, setOpenRecordMenuId] = useState<string | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null)
  const [draftDateISO, setDraftDateISO] = useState(() => toISODate(new Date()))
  const [draftCategory, setDraftCategory] = useState<ExerciseCategory>("Running")
  const [draftPrimaryValue, setDraftPrimaryValue] = useState("")
  const [draftSecondaryValue, setDraftSecondaryValue] = useState("")
  const [draftLiftingCategoryId, setDraftLiftingCategoryId] = useState<number | null>(null)

  const draftLabels = useMemo(() => labelsForCategory(draftCategory), [draftCategory])

  const liftingCategoryOptions = useMemo(() => {
    return (bestLiftsQuery.data ?? []).map((x) => ({
      id: x.liftingCategoryId,
      name: x.liftingCategoryName,
    }))
  }, [bestLiftsQuery.data])

  const draftCategoryId = useMemo(() => {
    const match = (categoriesQuery.data ?? []).find((c) => c.name === draftCategory)
    return match?.id ?? null
  }, [categoriesQuery.data, draftCategory])

  const selectedLiftingCategoryName = useMemo(() => {
    if (draftLiftingCategoryId == null) return ""
    const match = liftingCategoryOptions.find((x) => x.id === draftLiftingCategoryId)
    return match?.name ?? ""
  }, [draftLiftingCategoryId, liftingCategoryOptions])

  const openCreate = () => {
    setEditingRecordId(null)
    setDraftDateISO(toISODate(new Date()))
    setDraftCategory(categoryChips[0] ?? "Running")
    setDraftPrimaryValue("")
    setDraftSecondaryValue("")
    setDraftLiftingCategoryId(null)
    setIsCreateOpen(true)
  }

  const openEdit = (r: ExerciseRecord) => {
    setEditingRecordId(r.id)
    setDraftDateISO(r.dateISO)
    setDraftCategory(r.category)
    setDraftPrimaryValue(r.primaryValue)
    setDraftSecondaryValue(r.secondaryValue)
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
    return records
      .filter((r) => mostRecent3Days.includes(r.dateISO))
      .filter((r) => (selectedCategory === "All" ? true : r.category === selectedCategory))
      .filter((r) => {
        if (!q) return true
        return (
          r.category.toLowerCase().includes(q) ||
          r.primaryLabel.toLowerCase().includes(q) ||
          r.primaryValue.toLowerCase().includes(q) ||
          r.secondaryValue.toLowerCase().includes(q)
        )
      })
  }, [mostRecent3Days, query, records, selectedCategory])

  const grouped = useMemo(() => {
    const map = new Map<string, ExerciseRecord[]>()
    for (const r of filtered) {
      const arr = map.get(r.dateISO) ?? []
      arr.push(r)
      map.set(r.dateISO, arr)
    }
    // keep date ordering: newest -> oldest
    return mostRecent3Days
      .filter((d) => map.has(d))
      .map((d) => ({ dateISO: d, records: map.get(d) ?? [] }))
  }, [filtered, mostRecent3Days])

  return (
    <Box maxW="5xl" mx="auto" px={{ base: 5, md: 8 }} py={{ base: 8, md: 12 }}>
      <PageHeading
        title="Exercise"
        description="Search and filter your most recent activity (static preview)."
        showBack
      />

      <Stack gap={4} mb={6}>
        <Box>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search exercise… (e.g. Running, Bike, steps, km)"
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
              {filtered.length} record{filtered.length === 1 ? "" : "s"}
            </Text>
            <Button size="sm" onClick={openCreate}>
              Add record
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
                {editingRecordId ? "Edit record" : "New record"}
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
                      onClick={() => {
                        setDraftCategory(c)
                        if (c !== "Lifting") {
                          setDraftLiftingCategoryId(null)
                          setDraftPrimaryValue("")
                        } else {
                          const first = liftingCategoryOptions[0]
                          if (first) {
                            setDraftLiftingCategoryId(first.id)
                            setDraftPrimaryValue(first.name)
                          } else {
                            setDraftLiftingCategoryId(null)
                            setDraftPrimaryValue("")
                          }
                        }
                      }}
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
                  {draftLabels.primaryLabel.toUpperCase()}
                </Text>
                {draftCategory === "Lifting" ? (
                  <Box mt={2}>
                    <ButtonGroup size="sm" variant="outline" flexWrap="wrap" gap={2}>
                      {liftingCategoryOptions.map((opt) => (
                        <Button
                          key={opt.id}
                          onClick={() => {
                            setDraftLiftingCategoryId(opt.id)
                            setDraftPrimaryValue(opt.name)
                          }}
                          bg={draftLiftingCategoryId === opt.id ? "bg.muted" : "transparent"}
                          borderColor={draftLiftingCategoryId === opt.id ? "fg.muted" : undefined}
                        >
                          {opt.name}
                        </Button>
                      ))}
                    </ButtonGroup>
                    {liftingCategoryOptions.length === 0 && (
                      <Text color="fg.muted" fontSize="sm" mt={2}>
                        No muscle groups found. Run the lifting categories seed script first.
                      </Text>
                    )}
                  </Box>
                ) : (
                  <Input
                    mt={2}
                    value={draftPrimaryValue}
                    onChange={(e) => setDraftPrimaryValue(e.target.value)}
                    placeholder={
                      draftCategory === "Running"
                        ? "e.g. 6200"
                        : draftCategory === "Bike"
                          ? "e.g. 12.4"
                          : "e.g. 45"
                    }
                    bg="bg.muted"
                    borderRadius="xl"
                  />
                )}
              </Box>

              <Box>
                <Text color="fg.muted" fontSize="xs" fontWeight="medium" letterSpacing="0.08em">
                  {draftLabels.secondaryLabel.toUpperCase()}
                </Text>
                <Input
                  mt={2}
                  value={draftSecondaryValue}
                  onChange={(e) => setDraftSecondaryValue(e.target.value)}
                  placeholder={draftCategory === "Lifting" ? "e.g. 60kg" : "e.g. 32m"}
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
                onClick={() => {
                  const dateISO = draftDateISO.trim()
                  const secondaryValue = draftSecondaryValue.trim()
                  const primaryValue =
                    draftCategory === "Lifting"
                      ? selectedLiftingCategoryName.trim()
                      : draftPrimaryValue.trim()
                  if (!dateISO || !primaryValue || !secondaryValue) return

                  const { primaryLabel, secondaryLabel } = labelsForCategory(draftCategory)
                  setRecords((prev) => {
                    if (editingRecordId) {
                      return prev.map((x) =>
                        x.id === editingRecordId
                          ? {
                              ...x,
                              dateISO,
                              category: draftCategory,
                              primaryLabel,
                              primaryValue,
                              secondaryLabel,
                              secondaryValue,
                            }
                          : x
                      )
                    }

                    // Create is API-backed (adds to DB), then we prepend it locally for now.
                    if (!draftCategoryId) return prev

                    addRecordMutation.mutate(
                      {
                        categoryId: draftCategoryId,
                        recordDate: `${dateISO}T00:00:00`,
                        liftingCategoryId: draftCategory === "Lifting" ? draftLiftingCategoryId : null,
                        primaryLabel,
                        primaryValue,
                        secondaryLabel,
                        secondaryValue,
                      },
                      {
                        onSuccess: (newId) => {
                          setRecords((curr) => [
                            {
                              id: `${newId}`,
                              dateISO,
                              category: draftCategory,
                              primaryLabel,
                              primaryValue,
                              secondaryLabel,
                              secondaryValue,
                            },
                            ...curr,
                          ])
                          closeCreate()
                        },
                      }
                    )

                    return prev
                  })
                }}
                disabled={
                  !draftDateISO.trim() ||
                  (draftCategory === "Lifting"
                    ? !selectedLiftingCategoryName.trim()
                    : !draftPrimaryValue.trim()) ||
                  !draftSecondaryValue.trim() ||
                  (!editingRecordId && (!draftCategoryId || (draftCategory === "Lifting" && !draftLiftingCategoryId)))
                }
              >
                {editingRecordId ? "Save changes" : "Create record"}
              </Button>
            </Flex>
          </Box>
        </Box>
      )}

      <Box mb={6}>
        <BestExerciseRecord />
      </Box>

      <Stack gap={6} onMouseDown={() => setOpenRecordMenuId(null)}>
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
          grouped.map(({ dateISO, records }) => (
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
                {records.map((r) => (
                  <Box
                    key={r.id}
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
                      <Badge variant="subtle" borderRadius="md" px={2} py={1}>
                        {r.category}
                      </Badge>

                      <Box position="relative" onMouseDown={(e) => e.stopPropagation()}>
                        <IconButton
                          aria-label="Record actions"
                          variant="ghost"
                          size="sm"
                          color="fg.muted"
                          onClick={() => setOpenRecordMenuId((prev) => (prev === r.id ? null : r.id))}
                        >
                          <Icon as={FaEllipsisH} boxSize={4} />
                        </IconButton>

                        {openRecordMenuId === r.id && (
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
                                  openEdit(r)
                                  setOpenRecordMenuId(null)
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
                                  setRecords((prev) => prev.filter((x) => x.id !== r.id))
                                  setOpenRecordMenuId(null)
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

                    <Flex
                      mt={4}
                      justify="space-between"
                      align="flex-end"
                      gap={4}
                      flexWrap="wrap"
                    >
                      <Box>
                        <Text color="fg.muted" fontSize="xs" fontWeight="medium" letterSpacing="0.08em">
                          {r.primaryLabel.toUpperCase()}
                        </Text>
                        <Text fontSize="2xl" fontWeight="semibold" letterSpacing="-0.03em" mt={1}>
                          {r.primaryValue}
                        </Text>
                      </Box>

                      <Box textAlign={{ base: "left", sm: "right" }}>
                        <Text color="fg.muted" fontSize="xs" fontWeight="medium" letterSpacing="0.08em">
                          {r.secondaryLabel.toUpperCase()}
                        </Text>
                        <Text fontSize="2xl" fontWeight="semibold" letterSpacing="-0.03em" mt={1}>
                          {r.secondaryValue}
                        </Text>
                      </Box>
                    </Flex>
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

export default ExercisePage

