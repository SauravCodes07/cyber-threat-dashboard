import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { app } from './config';

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({ prompt: 'select_account' });

setPersistence(auth, browserLocalPersistence).catch(() => {
  /* persistence may fail in restricted contexts; auth still works */
});
