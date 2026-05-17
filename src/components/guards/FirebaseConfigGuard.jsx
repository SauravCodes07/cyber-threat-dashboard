import { validateFirebaseEnv } from '../../firebase/env';
import { FallbackScreen } from '../ui/FallbackScreen';

export function FirebaseConfigGuard({ children }) {
  const { valid, missing } = validateFirebaseEnv();

  if (!valid) {
    return (
      <FallbackScreen
        variant="config"
        message={`Missing: ${missing.map((k) => k.replace('VITE_', '')).join(', ')}. Configure environment variables for production.`}
      />
    );
  }

  return children;
}
