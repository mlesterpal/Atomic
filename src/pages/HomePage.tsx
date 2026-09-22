import { Box } from "@chakra-ui/react"
import HabitCards from "../components/HabitCards"
import PageHeading from "../components/PageHeading"

const HomePage = () => {
  return (
    <Box maxW="5xl" mx="auto" px={{ base: 5, md: 8 }} py={{ base: 8, md: 12 }}>
      <PageHeading title="Habits" />
      <HabitCards />
    </Box>
  )
}

export default HomePage
