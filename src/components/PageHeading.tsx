import { Box, Flex, Heading, Text } from "@chakra-ui/react"
import BackButton from "./BackButton"

const PageHeading = ({
  title,
  description,
  showBack = false,
}: {
  title: string
  description?: string
  showBack?: boolean
}) => {
  return (
    <Flex justify="space-between" align="flex-start" gap={4} mb={8}>
      <Box>
        <Heading
          as="h1"
          size="2xl"
          fontWeight="semibold"
          letterSpacing="-0.03em"
        >
          {title}
        </Heading>
        {description && (
          <Text color="fg.muted" mt={2} fontSize="md">
            {description}
          </Text>
        )}
      </Box>
      {showBack && <BackButton />}
    </Flex>
  )
}

export default PageHeading
