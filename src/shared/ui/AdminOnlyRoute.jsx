import { useContext } from 'react';
import AppContext from '../../features/context/AppContext';
import RestrictedPage from '../../pages/status/RestrictedPage';

export default function AdminOnlyRoute({ children }) {
  const { isAdmin } = useContext(AppContext);
  return isAdmin ? children : <RestrictedPage />;
}
