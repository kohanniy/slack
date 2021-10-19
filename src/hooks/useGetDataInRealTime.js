import { useEffect, useCallback, useState } from 'react';
import { getDataInRealTime, removeListeners } from '../firebase/firebaseApi';

const useGetDataInRealTime = (path, userId = null) => {
  const [ data, setData ] = useState([]);

  const handleDataAdded = useCallback((snap) => {
    let loadedData = [];
    
    snap.forEach((item) => {
      loadedData.push(item.val());
    });
    setData(loadedData);
  }, []);

  useEffect(() => {
    getDataInRealTime(path, handleDataAdded);

    return () => removeListeners(path)
  }, [handleDataAdded, path]);

  return {data, setData};
};

export default useGetDataInRealTime;