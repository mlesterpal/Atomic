import { Routes, Route } from "react-router-dom"
import HomePage from "../pages/HomePage"
import DevelopmentPage from "../pages/DevelopmentPage"
import ExercisePage from "../pages/ExercisePage"
import BookNotesPage from "../components/BookNotesPage"
import ReadingPage from "../components/ReadingPage"

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/reading" element={<ReadingPage />} />
      <Route path="/reading/:bookId" element={<BookNotesPage />} />
      <Route path="/development" element={<DevelopmentPage />} />
      <Route path="/exercise" element={<ExercisePage />} />
    </Routes>
  )
}

export default AppRoutes