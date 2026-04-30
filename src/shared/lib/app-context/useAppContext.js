import { useContext } from 'react';
import AppContext from './AppContext';

export default function useAppContext() {
  const contextValue = useContext(AppContext);

  if (!contextValue) {
    throw new Error('useAppContext must be used inside AppProvider.');
  }

  return contextValue;
}
