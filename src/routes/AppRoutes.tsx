import { Routes, Route } from "react-router-dom"
import HomePage from "../pages/HomePage"
import BookNotesPage from "../components/BookNotesPage"
import ReadingPage from "../components/ReadingPage"

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/reading" element={<ReadingPage />} />
      <Route path="/reading/:bookId" element={<BookNotesPage />} />
    </Routes>
  )
}

export default AppRoutes