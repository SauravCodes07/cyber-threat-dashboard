import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppRoutes } from './routes/AppRoutes';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { FirebaseConfigGuard } from './components/guards/FirebaseConfigGuard';

export default function App() {
  return (
    <ErrorBoundary>
      <FirebaseConfigGuard>
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </FirebaseConfigGuard>
    </ErrorBoundary>
  );
}
