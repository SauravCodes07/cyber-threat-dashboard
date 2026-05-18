/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase/auth';
import { ensureUserProfile, seedDatabase } from '../services/seedData';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [seeding, setSeeding] = useState(false);
  const online = useOnlineStatus();

  useEffect(() => {
    let mounted = true;

    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        if (!mounted) return;
        setAuthError(null);
        setUser(firebaseUser);

        if (firebaseUser && online) {
          try {
            setSeeding(true);
            await ensureUserProfile(firebaseUser);
            await seedDatabase(firebaseUser.uid);
          } catch {
            /* seed errors are non-fatal */
          } finally {
            if (mounted) setSeeding(false);
          }
        } else if (mounted) {
          setSeeding(false);
        }

        if (mounted) setLoading(false);
      },
      (err) => {
        if (!mounted) return;
        setAuthError(err.message || 'Authentication service unavailable');
        setLoading(false);
        setSeeding(false);
      }
    );

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [online]);

  const signInWithGoogle = useCallback(async () => {
    if (!online) {
      const msg = 'No network connection. Connect to the internet to sign in.';
      setError(msg);
      throw new Error(msg);
    }

    setError(null);
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        const msg =
          err.code === 'auth/network-request-failed'
            ? 'Network error during sign-in. Check your connection.'
            : err.message || 'Authentication failed';
        setError(msg);
      }
      throw err;
    }
  }, [online]);

  const signOut = useCallback(async () => {
    await firebaseSignOut(auth);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
    setAuthError(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        authError,
        seeding,
        online,
        signInWithGoogle,
        signOut,
        setError,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
