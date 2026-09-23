import { Box } from "@chakra-ui/react"
import PageHeading from "../components/PageHeading"
import TradingCalendar from "../components/TradingCalendar"

const TradingPage = () => {
  return (
    <Box maxW="5xl" mx="auto" px={{ base: 5, md: 8 }} py={{ base: 8, md: 12 }}>
      <PageHeading
        title="Trading"
        description="Track your trading habit day by day (static preview)."
        showBack
      />

      <TradingCalendar />
    </Box>
  )
}

export default TradingPage

