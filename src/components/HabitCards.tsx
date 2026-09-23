import { Box, Grid, Icon, Text } from "@chakra-ui/react"
import { FaBook } from "react-icons/fa"
import { LuChevronRight } from "react-icons/lu"
import { Link } from "react-router-dom"

const HabitCards = () => {
  const habits = [
    {
      id: 1,
      name: "Reading",
      description: "Books you’re building a habit around.",
      icon: FaBook,
      link: "/reading",
    },
  ]
  return (
    <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
      {habits.map((habit) => (
        <Box
          key={habit.id}
          asChild
          display="flex"
          alignItems="center"
          gap={4}
          p={5}
          borderWidth="1px"
          borderRadius="xl"
          bg="bg.panel"
          textDecoration="none"
          color="fg"
          transition="border-color 0.15s ease, transform 0.15s ease"
          _hover={{
            borderColor: "fg.muted",
            transform: "translateY(-2px)",
          }}
        >
          <Link to={habit.link}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              boxSize="12"
              flexShrink={0}
              borderRadius="lg"
              bg="bg.muted"
            >
              <Icon as={habit.icon} boxSize={5} />
            </Box>
            <Box flex="1" minW={0}>
              <Text fontWeight="semibold" fontSize="lg" letterSpacing="-0.02em">
                {habit.name}
              </Text>
              <Text color="fg.muted" fontSize="sm" mt={1}>
                {habit.description}
              </Text>
            </Box>
            <Icon as={LuChevronRight} boxSize={5} color="fg.muted" />
          </Link>
        </Box>
      ))}
    </Grid>
  )
}

export default HabitCards
