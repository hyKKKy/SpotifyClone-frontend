import { useAppContext } from '@shared/lib/app-context';
import RestrictedPage from '@pages/status/RestrictedPage';

export default function AdminOnlyRoute({ children }) {
  const { isAdmin } = useAppContext();
  return isAdmin ? children : <RestrictedPage />;
}
