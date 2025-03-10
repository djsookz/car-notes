import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import FuelPage from "./pages/FuelPage";
import RepairPage from "./pages/RepairPage";
import DocumentsPage from "./pages/DocumentsPage";
import NotificationsPage from "./pages/NotificationsPage";
import StatisticsPage from "./pages/StatisticsPage";
import LoginPage from "./pages/LoginPage";
import { MileageProvider } from "./utils/MileageContext";

const App = () => {
  return (
    <MileageProvider>
 <Routes>
      {/* Дефинираме маршрутите тук */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/fuel" element={<FuelPage />} />
      <Route path="/repair" element={<RepairPage />} />
      <Route path="/documents" element={<DocumentsPage />} />
      <Route path="/notifications" element={<NotificationsPage />} />
      <Route path="/statistics" element={<StatisticsPage />} />
    </Routes>
    </MileageProvider>
   
  );
};

export default App;
