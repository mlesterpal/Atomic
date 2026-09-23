import { Routes, Route } from "react-router-dom"
import HomePage from "../pages/HomePage"
import DevelopmentPage from "../pages/DevelopmentPage"
import BookNotesPage from "../components/BookNotesPage"
import ReadingPage from "../components/ReadingPage"

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/reading" element={<ReadingPage />} />
      <Route path="/reading/:bookId" element={<BookNotesPage />} />
      <Route path="/development" element={<DevelopmentPage />} />
    </Routes>
  )
}

export default AppRoutes