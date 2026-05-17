import { useState, useEffect, useCallback } from 'react';

function getIsStandalone() {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true ||
    document.referrer.includes('android-app://')
  );
}

export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(getIsStandalone);
  const [isStandalone, setIsStandalone] = useState(getIsStandalone);
  const [installing, setInstalling] = useState(false);
  const [installError, setInstallError] = useState(null);

  useEffect(() => {
    const onBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setInstallError(null);
    };

    const onInstalled = () => {
      setIsInstalled(true);
      setIsStandalone(true);
      setDeferredPrompt(null);
      setInstalling(false);
    };

    const onDisplayModeChange = () => {
      const standalone = getIsStandalone();
      setIsStandalone(standalone);
      setIsInstalled(standalone);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);
    window.matchMedia('(display-mode: standalone)').addEventListener('change', onDisplayModeChange);

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
      window
        .matchMedia('(display-mode: standalone)')
        .removeEventListener('change', onDisplayModeChange);
    };
  }, []);

  const canInstall = Boolean(deferredPrompt) && !isInstalled;

  const install = useCallback(async () => {
    if (!deferredPrompt) {
      setInstallError(
        isStandalone
          ? 'App is already installed.'
          : 'Install is not available. Use your browser menu → Install app, or try Chrome on desktop/Android.'
      );
      return false;
    }

    setInstalling(true);
    setInstallError(null);

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      setDeferredPrompt(null);

      if (outcome === 'accepted') {
        setIsInstalled(true);
        return true;
      }
      setInstallError('Installation was cancelled.');
      return false;
    } catch {
      setInstallError('Could not start installation. Please try again.');
      return false;
    } finally {
      setInstalling(false);
    }
  }, [deferredPrompt, isStandalone]);

  const dismissError = useCallback(() => setInstallError(null), []);

  return {
    canInstall,
    isInstalled,
    isStandalone,
    installing,
    installError,
    install,
    dismissError,
  };
}
