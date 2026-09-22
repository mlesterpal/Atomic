import { Box, Grid, Icon, Text } from "@chakra-ui/react"
import { FaBook } from "react-icons/fa"
import { Link } from "react-router-dom"

const HabitCards = () => {
  const habits = [
    {
      id: 1,
      name: "Reading",
      icon: FaBook,
      link: "/reading",
    },
  ]
  return (
    <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }} gap={4}>
      {habits.map((habit) => (
        <Box
          key={habit.id}
          asChild
          p={6}
          borderWidth="1px"
          borderRadius="xl"
          bg="bg.panel"
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap={3}
          transition="border-color 0.15s ease, transform 0.15s ease"
          _hover={{
            borderColor: "fg.muted",
            transform: "translateY(-2px)",
          }}
        >
          <Link to={habit.link}>
            <Icon as={habit.icon} boxSize={7} />
            <Text fontWeight="medium">{habit.name}</Text>
          </Link>
        </Box>
      ))}
    </Grid>
  )
}

export default HabitCards
