import { Box, Flex, HStack, Icon, Text, VStack } from "@chakra-ui/react"
import { useEffect, useMemo, useState } from "react"
import { LuCheck } from "react-icons/lu"
import { Tooltip } from "./ui/tooltip"
import { useColorModeValue } from "./ui/color-mode"

export type TradingData = Record<string, boolean> // YYYY-MM-DD -> traded?

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

const endOfWeekSunday = (d: Date) => {
  const x = new Date(d)
  const day = (x.getDay() + 6) % 7 // Mon=0 ... Sun=6
  x.setDate(x.getDate() + (6 - day))
  x.setHours(0, 0, 0, 0)
  return x
}

const addDays = (d: Date, days: number) => {
  const x = new Date(d)
  x.setDate(x.getDate() + days)
  return x
}

const diffDays = (a: Date, b: Date) => {
  const ms = 24 * 60 * 60 * 1000
  return Math.round((b.getTime() - a.getTime()) / ms)
}

const formatCellLabel = (d: Date, traded: boolean) => {
  const dateLabel = new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(d)
  return `${traded ? "Traded" : "No trade"} • ${dateLabel}`
}

const defaultDemoTrading = (days: Date[]) => {
  const data: TradingData = {}
  for (const d of days) data[toISODate(d)] = false
  return data
}

export type TradingCalendarProps = {
  year?: number
  data?: TradingData
  onChange?: (next: TradingData) => void
}

const TradingCalendar = ({ year, data, onChange }: TradingCalendarProps) => {
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

  const gridStart = useMemo(() => startOfWeekMonday(yearStart), [yearStart])
  const gridEnd = useMemo(() => endOfWeekSunday(yearEnd), [yearEnd])

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

  // local interactive preview state (can be replaced with persistence later)
  const [tradedByDate, setTradedByDate] = useState<TradingData>(() => {
    const base = data ?? defaultDemoTrading(allDays)
    return base
  })

  useEffect(() => {
    if (!data) return
    setTradedByDate((prev) => {
      // only update if actually different to avoid rerender loops
      const prevKeys = Object.keys(prev)
      const nextKeys = Object.keys(data)
      if (prevKeys.length === nextKeys.length) {
        let same = true
        for (const k of nextKeys) {
          if (prev[k] !== data[k]) {
            same = false
            break
          }
        }
        if (same) return prev
      }
      return data
    })
  }, [data])

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

  const cellSize = "4"
  const gap = 1
  const cell = `var(--chakra-sizes-${cellSize})`

  const cellBorderColor = useColorModeValue("blackAlpha.50", "whiteAlpha.100")
  const checkedBg = useColorModeValue("green.100", "green.900")
  const uncheckedBg = useColorModeValue("transparent", "transparent")
  const checkedColor = useColorModeValue("green.700", "green.200")

  return (
    <Box borderWidth="1px" borderRadius="2xl" bg="bg.panel" p={6}>
      <Flex justify="space-between" align="baseline" gap={4} flexWrap="wrap">
        <Box>
          <Text fontWeight="semibold" letterSpacing="-0.02em">
            Trading calendar
          </Text>
          <Text color="fg.muted" fontSize="sm" mt={1}>
            Checkbox view — tap a day to mark it.
          </Text>
        </Box>

        <HStack gap={3} align="center">
          <HStack gap={2}>
            <Box
              boxSize={cellSize}
              borderRadius="sm"
              borderWidth="1px"
              borderColor={cellBorderColor}
              bg={uncheckedBg}
            />
            <Text color="fg.muted" fontSize="sm">
              No trade
            </Text>
          </HStack>
          <HStack gap={2}>
            <Box
              boxSize={cellSize}
              borderRadius="sm"
              borderWidth="1px"
              borderColor={cellBorderColor}
              bg={checkedBg}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Icon as={LuCheck} boxSize={3} color={checkedColor} />
            </Box>
            <Text color="fg.muted" fontSize="sm">
              Traded
            </Text>
          </HStack>
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

          {/* Month labels + grid share the same horizontal scroll */}
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
                      const isInYear = d >= yearStart && d <= yearEnd
                      const traded = tradedByDate[key] ?? false

                      return (
                        <Tooltip
                          key={key}
                          content={isInYear ? formatCellLabel(d, traded) : "Outside selected year"}
                          showArrow
                          positioning={{ placement: "top" }}
                          disabled={!isInYear}
                        >
                          <Box
                            as="button"
                            aria-label={formatCellLabel(d, traded)}
                            role="checkbox"
                            aria-checked={traded}
                            aria-disabled={!isInYear}
                            tabIndex={isInYear ? 0 : -1}
                            onClick={() => {
                              if (!isInYear) return
                              setTradedByDate((prev) => {
                                const next = { ...prev, [key]: !(prev[key] ?? false) }
                                onChange?.(next)
                                return next
                              })
                            }}
                            boxSize={cellSize}
                            borderRadius="sm"
                            borderWidth="1px"
                            borderColor={cellBorderColor}
                            bg={traded ? checkedBg : uncheckedBg}
                            opacity={isInYear ? 1 : 0.35}
                            cursor={isInYear ? "pointer" : "not-allowed"}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            transition="transform 0.12s ease, border-color 0.12s ease"
                            _hover={
                              isInYear
                                ? {
                                    borderColor: "fg.muted",
                                    transform: "translateY(-1px)",
                                  }
                                : undefined
                            }
                            _focusVisible={{
                              outline: "2px solid",
                              outlineColor: "blue.400",
                              outlineOffset: "2px",
                            }}
                          >
                            {traded && <Icon as={LuCheck} boxSize={3} color={checkedColor} />}
                          </Box>
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

export default TradingCalendar

