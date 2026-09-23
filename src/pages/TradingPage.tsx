import { Box, Button, ButtonGroup, Flex, Heading, Input, Stack, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import PageHeading from "../components/PageHeading"
import TradingCalendar from "../components/TradingCalendar"
import { loadTradingData, saveTradingData, type TradingData } from "../state/tradingStore"

const TradingPage = () => {
  const [data, setData] = useState<TradingData>(() => loadTradingData())

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [draftDateISO, setDraftDateISO] = useState("")
  const [draftTraded, setDraftTraded] = useState(true)

  const openCreate = () => {
    const today = new Date()
    const yyyy = today.getFullYear()
    const mm = String(today.getMonth() + 1).padStart(2, "0")
    const dd = String(today.getDate()).padStart(2, "0")
    setDraftDateISO(`${yyyy}-${mm}-${dd}`)
    setDraftTraded(true)
    setIsCreateOpen(true)
  }

  const closeCreate = () => setIsCreateOpen(false)

  useEffect(() => {
    if (!isCreateOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCreate()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [isCreateOpen])

  return (
    <Box maxW="5xl" mx="auto" px={{ base: 5, md: 8 }} py={{ base: 8, md: 12 }}>
      <PageHeading
        title="Trading"
        description="Track your trading habit day by day."
        showBack
      />

      <Flex justify="space-between" align="center" gap={4} mb={6} flexWrap="wrap">
        <Text color="fg.muted" fontSize="sm">
          Tap a day to toggle the checkbox.
        </Text>
        <Button size="sm" onClick={openCreate}>
          Add record
        </Button>
      </Flex>

      {isCreateOpen && (
        <Box
          position="fixed"
          inset="0"
          zIndex="overlay"
          bg="blackAlpha.600"
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={4}
          onMouseDown={(e) => {
            if (e.currentTarget === e.target) closeCreate()
          }}
        >
          <Box
            role="dialog"
            aria-modal="true"
            w="full"
            maxW="lg"
            borderWidth="1px"
            borderRadius="2xl"
            bg="bg.panel"
            p={6}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <Flex justify="space-between" align="center" gap={4}>
              <Heading size="md" letterSpacing="-0.02em">
                New trading record
              </Heading>
              <Button variant="ghost" onClick={closeCreate}>
                Close
              </Button>
            </Flex>

            <Stack gap={4} mt={5}>
              <Box>
                <Text color="fg.muted" fontSize="xs" fontWeight="medium" letterSpacing="0.08em">
                  DATE
                </Text>
                <Input
                  mt={2}
                  type="date"
                  value={draftDateISO}
                  onChange={(e) => setDraftDateISO(e.target.value)}
                  bg="bg.muted"
                  borderRadius="xl"
                />
              </Box>

              <Box>
                <Text color="fg.muted" fontSize="xs" fontWeight="medium" letterSpacing="0.08em">
                  CHECKBOX
                </Text>
                <ButtonGroup mt={2} size="sm" variant="outline" gap={2} flexWrap="wrap">
                  <Button
                    onClick={() => setDraftTraded(true)}
                    bg={draftTraded ? "bg.muted" : "transparent"}
                    borderColor={draftTraded ? "fg.muted" : undefined}
                  >
                    Traded
                  </Button>
                  <Button
                    onClick={() => setDraftTraded(false)}
                    bg={!draftTraded ? "bg.muted" : "transparent"}
                    borderColor={!draftTraded ? "fg.muted" : undefined}
                  >
                    No trade
                  </Button>
                </ButtonGroup>
              </Box>
            </Stack>

            <Flex mt={6} justify="flex-end" gap={3} flexWrap="wrap">
              <Button variant="outline" onClick={closeCreate}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  const dateISO = draftDateISO.trim()
                  if (!dateISO) return
                  const next: TradingData = { ...data, [dateISO]: draftTraded }
                  setData(next)
                  saveTradingData(next)
                  closeCreate()
                }}
                disabled={!draftDateISO.trim()}
              >
                Save
              </Button>
            </Flex>
          </Box>
        </Box>
      )}

      <TradingCalendar
        data={data}
        onChange={(next) => {
          setData(next)
          saveTradingData(next)
        }}
      />
    </Box>
  )
}

export default TradingPage

