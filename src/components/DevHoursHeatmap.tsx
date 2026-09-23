import { Box, Flex, HStack, Text, VStack } from "@chakra-ui/react"
import { useMemo } from "react"
import { Tooltip } from "./ui/tooltip"
import { useColorModeValue } from "./ui/color-mode"

type HeatmapData = Record<string, number> // YYYY-MM-DD -> hours

const pad2 = (n: number) => String(n).padStart(2, "0")

const toISODate = (d: Date) => {
  const yyyy = d.getFullYear()
  const mm = pad2(d.getMonth() + 1)
  const dd = pad2(d.getDate())
  return `${yyyy}-${mm}-${dd}`
}

const startOfWeekMonday = (d: Date) => {
  const x = new Date(d)
  const day = (x.getDay() + 6) % 7 // Mon=0 ... Sun=6
  x.setDate(x.getDate() - day)
  x.setHours(0, 0, 0, 0)
  return x
}

const addDays = (d: Date, days: number) => {
  const x = new Date(d)
  x.setDate(x.getDate() + days)
  return x
}

const formatCellLabel = (d: Date, hours: number) => {
  const dateLabel = new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(d)
  return `${hours} hour${hours === 1 ? "" : "s"} • ${dateLabel}`
}

const hourToLevel = (hours: number) => {
  if (hours <= 0) return 0
  if (hours <= 1) return 1
  if (hours <= 3) return 2
  if (hours <= 5) return 3
  return 4
}

const defaultDemoHours = (days: Date[]) => {
  const data: HeatmapData = {}
  for (const d of days) {
    // For now, keep everything at 0 hours (no shades).
    data[toISODate(d)] = 0
  }
  return data
}

export type DevHoursHeatmapProps = {
  year?: number
  data?: HeatmapData
}

const endOfWeekSunday = (d: Date) => {
  const x = new Date(d)
  const day = (x.getDay() + 6) % 7 // Mon=0 ... Sun=6
  x.setDate(x.getDate() + (6 - day))
  x.setHours(0, 0, 0, 0)
  return x
}

const diffDays = (a: Date, b: Date) => {
  const ms = 24 * 60 * 60 * 1000
  return Math.round((b.getTime() - a.getTime()) / ms)
}

const DevHoursHeatmap = ({ year, data }: DevHoursHeatmapProps) => {
  const targetYear = useMemo(() => year ?? new Date().getFullYear(), [year])

  const yearStart = useMemo(() => {
    const d = new Date(targetYear, 0, 1)
    d.setHours(0, 0, 0, 0)
    return d
  }, [targetYear])

  const yearEnd = useMemo(() => {
    const d = new Date(targetYear, 11, 31)
    d.setHours(0, 0, 0, 0)
    return d
  }, [targetYear])

  const gridStart = useMemo(() => {
    return startOfWeekMonday(yearStart)
  }, [yearStart])

  const gridEnd = useMemo(() => {
    return endOfWeekSunday(yearEnd)
  }, [yearEnd])

  const weeks = useMemo(() => {
    const total = diffDays(gridStart, gridEnd) + 1
    return Math.max(1, Math.ceil(total / 7))
  }, [gridEnd, gridStart])

  const weeksGrid = useMemo(() => {
    const cols: Date[][] = []
    let cursor = new Date(gridStart)
    for (let w = 0; w < weeks; w += 1) {
      const col: Date[] = []
      for (let i = 0; i < 7; i += 1) col.push(addDays(cursor, i))
      cols.push(col)
      cursor = addDays(cursor, 7)
    }
    return cols
  }, [gridStart, weeks])

  const allDays = useMemo(() => weeksGrid.flat(), [weeksGrid])

  const hoursByDate = useMemo(() => data ?? defaultDemoHours(allDays), [allDays, data])

  const emptyColor = useColorModeValue("gray.200", "whiteAlpha.200")
  const cellBorderColor = useColorModeValue("blackAlpha.50", "whiteAlpha.100")
  const palette = useColorModeValue(
    [emptyColor, "green.100", "green.200", "green.300", "green.400"],
    [emptyColor, "green.900", "green.800", "green.700", "green.600"],
  )

  const cellSize = "3" // Chakra size token
  const gap = 1

  const monthLabels = useMemo(() => {
    const labels: { idx: number; text: string }[] = []
    let prev = ""
    for (let i = 0; i < weeksGrid.length; i += 1) {
      const inYearDay = weeksGrid[i].find((d) => d >= yearStart && d <= yearEnd)
      if (!inYearDay) continue
      const m = inYearDay.toLocaleString(undefined, { month: "short" })
      if (prev === "" || m !== prev) labels.push({ idx: i, text: m })
      prev = m
    }
    return labels
  }, [weeksGrid, yearEnd, yearStart])

  const monthLabelSpans = useMemo(() => {
    return monthLabels.map((l, i) => {
      const next = monthLabels[i + 1]?.idx ?? weeks
      const span = Math.max(1, next - l.idx)
      return { idx: l.idx, text: l.text, span }
    })
  }, [monthLabels, weeks])

  const legendLevels = [0, 1, 2, 3, 4]
  const cell = `var(--chakra-sizes-${cellSize})`

  return (
    <Box borderWidth="1px" borderRadius="2xl" bg="bg.panel" p={6}>
      <Flex justify="space-between" align="baseline" gap={4} flexWrap="wrap">
        <Box>
          <Text fontWeight="semibold" letterSpacing="-0.02em">
            Development hours
          </Text>
          <Text color="fg.muted" fontSize="sm" mt={1}>
            Static preview — darker squares mean more hours.
          </Text>
        </Box>

        <HStack gap={2} align="center">
          <Text color="fg.muted" fontSize="sm">
            Less
          </Text>
          <HStack gap={1}>
            {legendLevels.map((lvl) => (
              <Box key={lvl} boxSize={cellSize} borderRadius="sm" bg={palette[lvl]} />
            ))}
          </HStack>
          <Text color="fg.muted" fontSize="sm">
            More
          </Text>
        </HStack>
      </Flex>

      <Box mt={5}>
        <Flex gap={3} align="start">
          {/* Day labels */}
          <VStack gap={gap} align="flex-start" w="9" pt="6">
            {["Mon", "", "Wed", "", "Fri", "", ""].map((label, i) => (
              <Box key={i} h={cellSize} display="flex" alignItems="center">
                <Text fontSize="xs" color="fg.muted">
                  {label}
                </Text>
              </Box>
            ))}
          </VStack>

          {/* Month labels + Heatmap share the same horizontal scroll */}
          <Box overflowX="auto" pb={1} flex="1">
            <VStack align="stretch" gap={2} minW="fit-content">
              <Box
                display="grid"
                gridTemplateColumns={`repeat(${weeks}, ${cell})`}
                columnGap={gap}
                h="4"
              >
                {monthLabelSpans.map((m) => (
                  <Box
                    key={`${m.idx}-${m.text}`}
                    gridColumn={`${m.idx + 1} / span ${m.span}`}
                    minW={0}
                  >
                    <Text
                      fontSize="xs"
                      color="fg.muted"
                      lineHeight="1"
                      mt="0.5"
                      whiteSpace="nowrap"
                    >
                      {m.text}
                    </Text>
                  </Box>
                ))}
              </Box>

              <HStack gap={gap} align="start" flexWrap="nowrap">
                {weeksGrid.map((col, colIdx) => (
                  <VStack key={colIdx} gap={gap} align="stretch" flexShrink={0}>
                    {col.map((d) => {
                      const key = toISODate(d)
                      const hours = hoursByDate[key] ?? 0
                      const level = hourToLevel(hours)
                      const isInYear = d >= yearStart && d <= yearEnd
                      return (
                        <Tooltip
                          key={key}
                          content={isInYear ? formatCellLabel(d, hours) : "Outside selected year"}
                          showArrow
                          positioning={{ placement: "top" }}
                          disabled={!isInYear}
                        >
                          <Box
                            boxSize={cellSize}
                            borderRadius="sm"
                            bg={palette[level]}
                            opacity={isInYear ? 1 : 0.35}
                            borderWidth="1px"
                            borderColor={cellBorderColor}
                          />
                        </Tooltip>
                      )
                    })}
                  </VStack>
                ))}
              </HStack>
            </VStack>
          </Box>
        </Flex>
      </Box>
    </Box>
  )
}

export default DevHoursHeatmap

