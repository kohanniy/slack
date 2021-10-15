import { useEffect, useCallback, useState } from 'react';
import { childAddedListener, removeListeners, statusUser } from '../firebase/firebaseApi';

const useChildAddedListener = (path, userId = null) => {
  const [ data, setData ] = useState([]);

  const handleDataAdded = useCallback((snap) => {
    let loadedData = [];
    
    snap.forEach((item) => {
      loadedData.push(item.val());
    });
    setData(loadedData);
  }, []);

  useEffect(() => {
    childAddedListener(path, handleDataAdded);

    return () => removeListeners(path)
  }, [handleDataAdded, path]);

  return {data, setData};
};

export default useChildAddedListener;