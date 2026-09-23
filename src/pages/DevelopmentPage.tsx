import { Box, Button, Flex, Heading, Input, Stack, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import DevHoursHeatmap from "../components/DevHoursHeatmap"
import PageHeading from "../components/PageHeading"
import { loadDevHoursData, saveDevHoursData, type DevHoursData } from "../state/developmentStore"

const DevelopmentPage = () => {
  const [data, setData] = useState<DevHoursData>(() => loadDevHoursData())

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [draftDateISO, setDraftDateISO] = useState("")
  const [draftHours, setDraftHours] = useState("")

  const openCreate = () => {
    const today = new Date()
    const yyyy = today.getFullYear()
    const mm = String(today.getMonth() + 1).padStart(2, "0")
    const dd = String(today.getDate()).padStart(2, "0")
    setDraftDateISO(`${yyyy}-${mm}-${dd}`)
    setDraftHours("")
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
        title="Development"
        description="Add a date + hours record and it will reflect in the calendar."
        showBack
      />

      <Flex justify="space-between" align="center" gap={4} mb={6} flexWrap="wrap">
        <Text color="fg.muted" fontSize="sm">
          Click a day’s square to preview the tooltip. Add records to change the shade.
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
                New dev record
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
                  HOURS
                </Text>
                <Input
                  mt={2}
                  type="number"
                  inputMode="decimal"
                  value={draftHours}
                  onChange={(e) => setDraftHours(e.target.value)}
                  placeholder="e.g. 2.5"
                  bg="bg.muted"
                  borderRadius="xl"
                />
              </Box>
            </Stack>

            <Flex mt={6} justify="flex-end" gap={3} flexWrap="wrap">
              <Button variant="outline" onClick={closeCreate}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  const dateISO = draftDateISO.trim()
                  const hoursRaw = draftHours.trim()
                  const hours = Number(hoursRaw)
                  if (!dateISO || !hoursRaw || !Number.isFinite(hours) || hours < 0) return

                  const next: DevHoursData = { ...data, [dateISO]: hours }
                  setData(next)
                  saveDevHoursData(next)
                  closeCreate()
                }}
                disabled={!draftDateISO.trim() || !draftHours.trim()}
              >
                Save
              </Button>
            </Flex>
          </Box>
        </Box>
      )}

      <DevHoursHeatmap data={data} />
    </Box>
  )
}

export default DevelopmentPage

