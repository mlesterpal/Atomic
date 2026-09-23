import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Flex,
  Grid,
  Heading,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react"
import { useMemo, useState } from "react"
import PageHeading from "../components/PageHeading"

type ExerciseCategory = "Running" | "Bike" | "Lifting" | "Basketball"

type ExerciseRecord = {
  id: string
  dateISO: string // YYYY-MM-DD
  category: ExerciseCategory
  primaryLabel: string // Steps / KM
  primaryValue: string // 6,200 / 12.4
  timeLabel: string // Time
  timeValue: string // 32m
}

const categoryChips: ExerciseCategory[] = ["Running", "Bike", "Lifting", "Basketball"]

const formatDateHeading = (iso: string) => {
  const d = new Date(`${iso}T00:00:00`)
  return new Intl.DateTimeFormat(undefined, {
    month: "long",
    day: "2-digit",
  }).format(d)
}

const ExercisePage = () => {
  // Static/sample data for layout preview
  const records: ExerciseRecord[] = useMemo(
    () => [
      // Sep 23
      {
        id: "2026-09-23-running",
        dateISO: "2026-09-23",
        category: "Running",
        primaryLabel: "Steps",
        primaryValue: "6,200",
        timeLabel: "Time",
        timeValue: "32m",
      },
      {
        id: "2026-09-23-bike",
        dateISO: "2026-09-23",
        category: "Bike",
        primaryLabel: "KM",
        primaryValue: "12.4",
        timeLabel: "Time",
        timeValue: "41m",
      },

      // Sep 22
      {
        id: "2026-09-22-running",
        dateISO: "2026-09-22",
        category: "Running",
        primaryLabel: "Steps",
        primaryValue: "5,100",
        timeLabel: "Time",
        timeValue: "26m",
      },
      {
        id: "2026-09-22-bike",
        dateISO: "2026-09-22",
        category: "Bike",
        primaryLabel: "KM",
        primaryValue: "8.6",
        timeLabel: "Time",
        timeValue: "29m",
      },

      // Sep 21
      {
        id: "2026-09-21-running",
        dateISO: "2026-09-21",
        category: "Running",
        primaryLabel: "Steps",
        primaryValue: "7,430",
        timeLabel: "Time",
        timeValue: "38m",
      },
      {
        id: "2026-09-21-bike",
        dateISO: "2026-09-21",
        category: "Bike",
        primaryLabel: "KM",
        primaryValue: "10.1",
        timeLabel: "Time",
        timeValue: "35m",
      },
    ],
    []
  )

  const mostRecent3Days = useMemo(() => {
    const unique = Array.from(new Set(records.map((r) => r.dateISO))).sort((a, b) =>
      b.localeCompare(a)
    )
    return unique.slice(0, 3)
  }, [records])

  const [query, setQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<ExerciseCategory | "All">("All")

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
          r.timeValue.toLowerCase().includes(q)
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

          <Text color="fg.muted" fontSize="sm">
            {filtered.length} record{filtered.length === 1 ? "" : "s"}
          </Text>
        </Flex>
      </Stack>

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
                      <Box minW={0}>
                        <Text fontWeight="semibold" fontSize="lg" letterSpacing="-0.02em">
                          {r.category}
                        </Text>
                        <Text color="fg.muted" fontSize="sm" mt={1}>
                          Type of exercise
                        </Text>
                      </Box>
                      <Badge variant="subtle" borderRadius="md" px={2} py={1}>
                        {r.category}
                      </Badge>
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
                          {r.timeLabel.toUpperCase()}
                        </Text>
                        <Text fontSize="2xl" fontWeight="semibold" letterSpacing="-0.03em" mt={1}>
                          {r.timeValue}
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

