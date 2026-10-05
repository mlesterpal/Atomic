import { Badge, Box, Flex, Grid, Heading, Text } from "@chakra-ui/react"
import { useMemo } from "react"
import { Link as RouterLink } from "react-router-dom"
import { useGetBestExerciseRecords } from "../hooks/exerciseRepository"

const BestExerciseRecord = () => {
  const bestQuery = useGetBestExerciseRecords()
  const best = useMemo(() => bestQuery.data ?? [], [bestQuery.data])

  return (
    <Box borderWidth="1px" borderRadius="2xl" bg="bg.panel" p={6}>
      <Flex justify="space-between" align="baseline" gap={4} flexWrap="wrap">
        <Box>
          <Heading size="md" letterSpacing="-0.02em">
            Best records
          </Heading>
          <Text color="fg.muted" mt={2}>
            Each exercise’s best record.
          </Text>
        </Box>
      </Flex>

      <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4} mt={5}>
        {bestQuery.isLoading ? (
          <Box borderWidth="1px" borderRadius="2xl" bg="bg.muted" p={5}>
            <Text color="fg.muted">Loading…</Text>
          </Box>
        ) : best.length === 0 ? (
          <Box borderWidth="1px" borderRadius="2xl" bg="bg.muted" p={5}>
            <Text color="fg.muted">No records yet.</Text>
          </Box>
        ) : (
          best.map((b) => {
            const isLifting = b.categoryName.toLowerCase() === "lifting"
            return (
              <Box
                key={b.categoryId}
                as={isLifting ? RouterLink : undefined}
                to={isLifting ? "/best-lifts" : undefined}
                borderWidth="1px"
                borderRadius="2xl"
                bg="bg.muted"
                p={5}
                display="block"
                transition="border-color 0.15s ease, transform 0.15s ease"
                _hover={isLifting ? { borderColor: "fg.muted", transform: "translateY(-2px)" } : undefined}
              >
                <Flex justify="space-between" align="start" gap={4}>
                  <Box minW={0}>
                    <Text fontWeight="semibold" fontSize="lg" letterSpacing="-0.02em">
                      {b.categoryName}
                    </Text>

                    {isLifting ? (
                      <Text color="fg.muted" fontSize="sm" mt={1}>
                        View best lift per muscle group
                      </Text>
                    ) : (
                      b.recordDate && (
                        <Text color="fg.muted" fontSize="sm" mt={1}>
                          {b.recordDate.slice(0, 10)}
                        </Text>
                      )
                    )}
                  </Box>

                  <Badge variant="subtle" borderRadius="md" px={2} py={1}>
                    Best
                  </Badge>
                </Flex>

                {isLifting ? (
                  <Flex mt={4} justify="space-between" align="flex-end" gap={4} flexWrap="wrap">
                    <Box>
                      <Text color="fg.muted" fontSize="xs" fontWeight="medium" letterSpacing="0.08em">
                        OPEN
                      </Text>
                      <Text fontSize="2xl" fontWeight="semibold" letterSpacing="-0.03em" mt={1}>
                        Best lifts
                      </Text>
                    </Box>
                  </Flex>
                ) : (
                  <Flex mt={4} justify="space-between" align="flex-end" gap={4} flexWrap="wrap">
                    <Box>
                      <Text color="fg.muted" fontSize="xs" fontWeight="medium" letterSpacing="0.08em">
                        {(b.primaryLabel ?? "Primary").toUpperCase()}
                      </Text>
                      <Text fontSize="2xl" fontWeight="semibold" letterSpacing="-0.03em" mt={1}>
                        {b.primaryValue ?? "—"}
                      </Text>
                    </Box>

                    <Box textAlign={{ base: "left", sm: "right" }}>
                      <Text color="fg.muted" fontSize="xs" fontWeight="medium" letterSpacing="0.08em">
                        {(b.secondaryLabel ?? "Secondary").toUpperCase()}
                      </Text>
                      <Text fontSize="2xl" fontWeight="semibold" letterSpacing="-0.03em" mt={1}>
                        {b.secondaryValue ?? "—"}
                      </Text>
                    </Box>
                  </Flex>
                )}
              </Box>
            )
          })
        )}
      </Grid>
    </Box>
  )
}

export default BestExerciseRecord

