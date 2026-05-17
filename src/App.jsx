import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PwaInstallProvider } from './context/PwaInstallContext';
import { AppRoutes } from './routes/AppRoutes';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { FirebaseConfigGuard } from './components/guards/FirebaseConfigGuard';
import { PwaUpdatePrompt } from './components/pwa/PwaUpdatePrompt';

export default function App() {
  return (
    <ErrorBoundary>
      <FirebaseConfigGuard>
        <BrowserRouter>
          <AuthProvider>
            <PwaInstallProvider>
              <PwaUpdatePrompt />
              <AppRoutes />
            </PwaInstallProvider>
          </AuthProvider>
        </BrowserRouter>
      </FirebaseConfigGuard>
    </ErrorBoundary>
  );
}
