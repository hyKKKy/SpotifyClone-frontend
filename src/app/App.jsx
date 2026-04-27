import { BrowserRouter } from 'react-router-dom';
import './ui/App.css';
import '../pages/api/ApiPages.css';
import AppProvider from './AppProvider';
import AppRoutes from './AppRoutes';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
