import { getDatabase, onValue, ref } from 'firebase/database';
import { useEffect, useState } from 'react';

const db = getDatabase();

function useDb(path) {
  const [loadedPath, setLoadedPath] = useState(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    return onValue(
      ref(db, path),
      (snapshot) => {
        setData(snapshot.val());
        setError(null);
        setLoadedPath(path);
      },
      (error) => {
        setData(null);
        setError(error);
        setLoadedPath(path);
      },
    );
  }, [path]);

  // Loading is true when the path doesn't match what we have data for
  const loading = loadedPath !== path;

  return [loading ? null : data, loading, loading ? null : error];
}

export default useDb;
