import { Routes, Route } from "react-router-dom"
import HomePage from "../pages/HomePage"
import DevelopmentPage from "../pages/DevelopmentPage"
import ExercisePage from "../pages/ExercisePage"
import SpiritualPage from "../pages/SpiritualPage"
import TradingPage from "../pages/TradingPage"
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
      <Route path="/spiritual" element={<SpiritualPage />} />
      <Route path="/trading" element={<TradingPage />} />
    </Routes>
  )
}

export default AppRoutes