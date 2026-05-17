import { useEffect, useState } from 'react';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  limit,
  getDocs,
} from 'firebase/firestore';
import { db } from '../firebase/firestore';

export function useFirestoreCollection(collectionName, options = {}) {
  const { orderByField = 'createdAt', orderDirection = 'desc', maxItems = 100 } = options;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);

    const applySnapshot = (snapshot) => {
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setData(items.slice(0, maxItems));
      setLoading(false);
      setError(null);
    };

    const q = query(
      collection(db, collectionName),
      orderBy(orderByField, orderDirection),
      limit(maxItems)
    );

    const unsubscribe = onSnapshot(
      q,
      applySnapshot,
      async (err) => {
        try {
          const fallbackSnap = await getDocs(collection(db, collectionName));
          applySnapshot(fallbackSnap);
        } catch {
          setError(err.message);
          setLoading(false);
        }
      }
    );

    return unsubscribe;
  }, [collectionName, orderByField, orderDirection, maxItems]);

  return { data, loading, error };
}
