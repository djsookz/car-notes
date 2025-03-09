import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import FuelPage from './pages/FuelPage';
import RepairPage from './pages/RepairPage';
import NotesPage from './pages/NotesPage';
import NotificationsPage from './pages/NotificationsPage';
import StatisticsPage from './pages/StatisticsPage';
import LoginPage from './pages/LoginPage';

const App = () => {
  return (
    <Routes>  {/* Дефинираме маршрутите тук */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/fuel" element={<FuelPage />} />
      <Route path="/repair" element={<RepairPage />} />
      <Route path="/notes" element={<NotesPage />} />
      <Route path="/notifications" element={<NotificationsPage />} />
      <Route path="/statistics" element={<StatisticsPage />} />
    </Routes>
  );
};

export default App;
