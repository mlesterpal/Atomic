import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import ReadingPage from "../components/ReadingPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/reading" element={<ReadingPage />} />
    </Routes>
  );
};

export default AppRoutes;