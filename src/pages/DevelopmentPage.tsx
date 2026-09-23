import { Box } from "@chakra-ui/react"
import DevHoursHeatmap from "../components/DevHoursHeatmap"
import PageHeading from "../components/PageHeading"

const DevelopmentPage = () => {
  return (
    <Box maxW="5xl" mx="auto" px={{ base: 5, md: 8 }} py={{ base: 8, md: 12 }}>
      <PageHeading
        title="Development"
        description="A simple visual of your dev habit (static preview)."
        showBack
      />

      <DevHoursHeatmap />
    </Box>
  )
}

export default DevelopmentPage

