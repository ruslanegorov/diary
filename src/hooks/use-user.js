import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';

const auth = getAuth();

function useUser() {
  const [user, setUser] = useState(auth.currentUser);
  const [loading, setLoading] = useState(() => !auth.currentUser);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (nextUser) => {
        setUser(nextUser);
        setLoading(false);
        setError(null);
      },
      (firebaseError) => {
        setError(firebaseError);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  return [user, loading, error];
}

export default useUser;
