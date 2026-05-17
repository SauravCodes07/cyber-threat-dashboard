import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ThreatDataProvider } from '../context/ThreatDataContext';
import { ProtectedRoute } from './ProtectedRoute';
import { MainLayout } from '../components/layout/MainLayout';
import { LoadingScreen } from '../components/ui/FallbackScreen';
import { FallbackScreen } from '../components/ui/FallbackScreen';

const Login = lazy(() => import('../pages/Login'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const ThreatIntelligence = lazy(() => import('../pages/ThreatIntelligence'));
const AttackSurface = lazy(() => import('../pages/AttackSurface'));
const VulnerabilityAnalysis = lazy(() => import('../pages/VulnerabilityAnalysis'));
const AIAssistant = lazy(() => import('../pages/AIAssistant'));
const Profile = lazy(() => import('../pages/Profile'));

export function AppRoutes() {
  const { user, loading, authError, clearError } = useAuth();

  if (!loading && authError && !user) {
    return (
      <FallbackScreen
        variant="auth"
        message={authError}
        onRetry={() => {
          clearError();
          window.location.reload();
        }}
      />
    );
  }

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route
          path="/login"
          element={!loading && user ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        <Route
          element={
            <ProtectedRoute>
              <ThreatDataProvider>
                <MainLayout />
              </ThreatDataProvider>
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/threats" element={<ThreatIntelligence />} />
          <Route path="/attack-surface" element={<AttackSurface />} />
          <Route path="/vulnerabilities" element={<VulnerabilityAnalysis />} />
          <Route path="/ai-assistant" element={<AIAssistant />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
      </Routes>
    </Suspense>
  );
}
