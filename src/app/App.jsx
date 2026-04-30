import { BrowserRouter } from 'react-router-dom';
import '@app/styles/App.css';
import '@shared/styles/api-pages.css';
import AppProvider from '@app/providers/AppProvider';
import AppRoutes from '@app/router/AppRoutes';

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
