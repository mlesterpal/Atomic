import { Badge, Box, Flex, Grid, Heading, Text } from "@chakra-ui/react"
import { useMemo } from "react"
import PageHeading from "../components/PageHeading"
import { useGetBestLiftsByMuscleGroup } from "../hooks/exerciseRepository"

const BestLiftsPage = () => {
  const bestQuery = useGetBestLiftsByMuscleGroup()
  const rows = useMemo(() => bestQuery.data ?? [], [bestQuery.data])

  return (
    <Box maxW="5xl" mx="auto" px={{ base: 5, md: 8 }} py={{ base: 8, md: 12 }}>
      <PageHeading
        title="Best Lifts"
        description="Your best lift (highest weight) for each muscle group."
        showBack
      />

      <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
        {bestQuery.isLoading ? (
          <Box borderWidth="1px" borderRadius="2xl" bg="bg.panel" p={6}>
            <Text color="fg.muted">Loading…</Text>
          </Box>
        ) : rows.length === 0 ? (
          <Box borderWidth="1px" borderRadius="2xl" bg="bg.panel" p={6}>
            <Heading size="md" letterSpacing="-0.02em">
              No muscle groups
            </Heading>
            <Text color="fg.muted" mt={2}>
              Add lifting categories first.
            </Text>
          </Box>
        ) : (
          rows.map((r) => {
            const hasRecord = Boolean(r.recordId && r.weightValue)
            return (
              <Box
                key={r.liftingCategoryId}
                borderWidth="1px"
                borderRadius="2xl"
                bg="bg.panel"
                p={6}
              >
                <Flex justify="space-between" align="start" gap={4}>
                  <Box minW={0}>
                    <Text fontWeight="semibold" fontSize="lg" letterSpacing="-0.02em">
                      {r.liftingCategoryName}
                    </Text>
                    {hasRecord && r.recordDate && (
                      <Text color="fg.muted" fontSize="sm" mt={1}>
                        {r.recordDate.slice(0, 10)}
                      </Text>
                    )}
                    {!hasRecord && (
                      <Text color="fg.muted" fontSize="sm" mt={1}>
                        No record yet
                      </Text>
                    )}
                  </Box>

                  <Badge variant="subtle" borderRadius="md" px={2} py={1}>
                    {hasRecord ? "Best" : "Empty"}
                  </Badge>
                </Flex>

                <Flex mt={4} justify="space-between" align="flex-end" gap={4} flexWrap="wrap">
                  <Box>
                    <Text color="fg.muted" fontSize="xs" fontWeight="medium" letterSpacing="0.08em">
                      WEIGHT
                    </Text>
                    <Text fontSize="2xl" fontWeight="semibold" letterSpacing="-0.03em" mt={1}>
                      {hasRecord ? r.weightValue : "—"}
                    </Text>
                  </Box>
                </Flex>
              </Box>
            )
          })
        )}
      </Grid>
    </Box>
  )
}

export default BestLiftsPage

