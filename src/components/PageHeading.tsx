import { Heading } from "@chakra-ui/react"

const PageHeading = ({ title }: { title: string }) => {
  return (
    <Heading
      as="h1"
      size="2xl"
      fontWeight="semibold"
      letterSpacing="-0.03em"
      mb={8}
    >
      {title}
    </Heading>
  )
}

export default PageHeading
