/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from 'react';
import { usePwaInstall } from '../hooks/usePwaInstall';

const PwaInstallContext = createContext(null);

export function PwaInstallProvider({ children }) {
  const value = usePwaInstall();
  return (
    <PwaInstallContext.Provider value={value}>{children}</PwaInstallContext.Provider>
  );
}

export function usePwaInstallContext() {
  const ctx = useContext(PwaInstallContext);
  if (!ctx) {
    throw new Error('usePwaInstallContext must be used within PwaInstallProvider');
  }
  return ctx;
}
