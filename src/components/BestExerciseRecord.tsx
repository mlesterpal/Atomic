import { Badge, Box, Flex, Grid, Heading, Text } from "@chakra-ui/react"

type BestItem = {
  category: "Running" | "Bike" | "Lifting" | "Basketball"
  primaryLabel: string
  primaryValue: string
  secondaryLabel: string
  secondaryValue: string
  note?: string
}

const BestExerciseRecord = () => {
  // Static preview only (no calculations yet)
  const best: BestItem[] = [
    {
      category: "Running",
      primaryLabel: "Steps",
      primaryValue: "9,800",
      secondaryLabel: "Time",
      secondaryValue: "52m",
      note: "Best day this month",
    },
    {
      category: "Bike",
      primaryLabel: "KM",
      primaryValue: "18.6",
      secondaryLabel: "Time",
      secondaryValue: "58m",
      note: "Longest ride",
    },
    {
      category: "Lifting",
      primaryLabel: "Body parts",
      primaryValue: "Back / Biceps",
      secondaryLabel: "Weight",
      secondaryValue: "70kg",
      note: "Heaviest set",
    },
    {
      category: "Basketball",
      primaryLabel: "Shots made",
      primaryValue: "63",
      secondaryLabel: "Time",
      secondaryValue: "1h 12m",
      note: "Most makes",
    },
  ]

  return (
    <Box borderWidth="1px" borderRadius="2xl" bg="bg.panel" p={6}>
      <Flex justify="space-between" align="baseline" gap={4} flexWrap="wrap">
        <Box>
          <Heading size="md" letterSpacing="-0.02em">
            Best records
          </Heading>
          <Text color="fg.muted" mt={2}>
            Static preview — each exercise’s best record.
          </Text>
        </Box>
      </Flex>

      <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4} mt={5}>
        {best.map((b) => (
          <Box key={b.category} borderWidth="1px" borderRadius="2xl" bg="bg.muted" p={5}>
            <Flex justify="space-between" align="start" gap={4}>
              <Box minW={0}>
                <Text fontWeight="semibold" fontSize="lg" letterSpacing="-0.02em">
                  {b.category}
                </Text>
                {b.note && (
                  <Text color="fg.muted" fontSize="sm" mt={1}>
                    {b.note}
                  </Text>
                )}
              </Box>
              <Badge variant="subtle" borderRadius="md" px={2} py={1}>
                Best
              </Badge>
            </Flex>

            <Flex mt={4} justify="space-between" align="flex-end" gap={4} flexWrap="wrap">
              <Box>
                <Text color="fg.muted" fontSize="xs" fontWeight="medium" letterSpacing="0.08em">
                  {b.primaryLabel.toUpperCase()}
                </Text>
                <Text fontSize="2xl" fontWeight="semibold" letterSpacing="-0.03em" mt={1}>
                  {b.primaryValue}
                </Text>
              </Box>

              <Box textAlign={{ base: "left", sm: "right" }}>
                <Text color="fg.muted" fontSize="xs" fontWeight="medium" letterSpacing="0.08em">
                  {b.secondaryLabel.toUpperCase()}
                </Text>
                <Text fontSize="2xl" fontWeight="semibold" letterSpacing="-0.03em" mt={1}>
                  {b.secondaryValue}
                </Text>
              </Box>
            </Flex>
          </Box>
        ))}
      </Grid>
    </Box>
  )
}

export default BestExerciseRecord

