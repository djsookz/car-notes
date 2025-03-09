import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';  // Импортираме BrowserRouter

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <Router>  {/* Обвиваме приложението в BrowserRouter тук */}
    <App />
  </Router>
);
