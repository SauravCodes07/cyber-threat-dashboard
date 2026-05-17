const REQUIRED_KEYS = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
];

export function validateFirebaseEnv() {
  const missing = REQUIRED_KEYS.filter((key) => !import.meta.env[key]);
  return {
    valid: missing.length === 0,
    missing,
  };
}
