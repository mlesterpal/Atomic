import { IconButton } from "@chakra-ui/react"
import { LuArrowLeft } from "react-icons/lu"
import { useLocation, useNavigate } from "react-router-dom"

const BackButton = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const handleBack = () => {
    if (location.key !== "default") {
      navigate(-1)
      return
    }
    navigate("/")
  }

  return (
    <IconButton
      aria-label="Go back"
      variant="ghost"
      rounded="full"
      size="sm"
      onClick={handleBack}
    >
      <LuArrowLeft />
    </IconButton>
  )
}

export default BackButton
