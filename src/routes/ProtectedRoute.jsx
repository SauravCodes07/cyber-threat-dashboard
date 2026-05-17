import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoadingScreen } from '../components/ui/FallbackScreen';

export function ProtectedRoute({ children }) {
  const { user, loading, seeding } = useAuth();
  const location = useLocation();

  if (loading || seeding) {
    return (
      <LoadingScreen
        message={
          seeding ? 'Initializing threat intelligence...' : 'Authenticating secure session...'
        }
      />
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
