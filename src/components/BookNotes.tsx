import {
  Badge,
  Box,
  Flex,
  Grid,
  Heading,
  HStack,
  Icon,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react"
import { LuBookOpen, LuQuote, LuStar } from "react-icons/lu"
import type { ElementType } from "react"

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

  return (
    <Stack gap={5}>
      <Box borderWidth="1px" borderRadius="2xl" bg="bg.panel" p={6}>
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
          <StatCard
            icon={LuBookOpen}
            label="Last page read"
            value={typeof lastPageRead === "number" ? `Page ${lastPageRead}` : "—"}
            subValue="(static placeholder)"
          />
          <StatCard
            icon={LuQuote}
            label="Favorite lines"
            value={`${quotes.length}`}
            subValue="(static placeholder)"
          />
        </Grid>
      </Box>

      <Box borderWidth="1px" borderRadius="2xl" bg="bg.panel" p={6}>
        <Flex justify="space-between" align="baseline" gap={4}>
          <Heading size="md" letterSpacing="-0.02em">
            Favorite lines
          </Heading>
          <Text color="fg.muted" fontSize="sm">
            {quotes.length} saved
          </Text>
        </Flex>

        {quotes.length === 0 ? (
          <Box mt={4} borderWidth="1px" borderRadius="xl" bg="bg.muted" p={5}>
            <Text fontWeight="semibold">No favorite lines yet</Text>
            <Text color="fg.muted" mt={1}>
              This section will show your saved quotes for the selected book.
            </Text>
          </Box>
        ) : (
          <VStack align="stretch" gap={3} mt={4}>
            {quotes.map((q) => (
              <Box key={q.id} borderWidth="1px" borderRadius="xl" p={4} bg="bg.muted">
                <Flex justify="space-between" align="center" gap={4}>
                  <HStack gap={2} minW={0}>
                    {q.favorite && <Icon as={LuStar} boxSize={4} color="yellow.400" />}
                    <Text color="fg.muted" fontSize="sm">
                      {typeof q.page === "number" ? `p. ${q.page}` : "—"}
                    </Text>
                  </HStack>
                </Flex>

                <Text mt={3} fontSize="md" lineHeight="tall">
                  “{q.text}”
                </Text>
              </Box>
            ))}
          </VStack>
        )}
      </Box>
    </Stack>
  )
}

export default BookNotes