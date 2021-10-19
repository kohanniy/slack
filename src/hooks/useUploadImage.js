import { getDownloadURL } from '@firebase/storage';
import { useEffect, useCallback, useReducer, useRef } from 'react';
import { saveMediaFilesToStorage } from '../firebase/firebaseApi';
import { v4 as uuidv4 } from 'uuid';

const defaultInitialState = {
  uploadStatus: 'idle',
  uploadTask: null,
  imageUrl: '',
  percentUploaded: 0,
  uploadError: null
};

const reducer = (state, action) => ({ ...state, ...action });

const useUploadImage = (initialState) => {
  const initialStateRef = useRef({
    ...defaultInitialState,
    ...initialState,
  });

  const [
    { 
      uploadStatus,
      uploadTask,
      imageUrl,
      percentUploaded,
      uploadError
    }, 
    dispatch
  ] = useReducer(reducer, initialStateRef.current);

  const onSubmit = (data) => {
    const metadata = { contentType: data.file[0].type };
    const filePath = `chat/public/${uuidv4()}.jpg`;
    const uploadTask = saveMediaFilesToStorage(filePath, data.file[0], metadata);
    dispatch({ uploadTask })
  };

  const handleUploadProgress = (snapshot) => {
    const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
    dispatch({ uploadStatus: 'loading', percentUploaded: progress})
  };

  const handleUploadError = (error) => {
    dispatch({uploadStatus: 'rejected', uploadError: error, uploadTask: null})
  };

  const handleUploadSuccess = useCallback(async () => {
    try {
      const url = await getDownloadURL(uploadTask.snapshot.ref);
      dispatch({ imageUrl: url, uploadTask: null, uploadStatus: 'resolved'});
    } catch (err) {
      handleUploadError(err);
    }
  }, [uploadTask]);

  const reset = useCallback(() => dispatch(initialStateRef.current), []);

  useEffect(() => {
    if (uploadTask !== null) {
      uploadTask.on('state_changed',
        handleUploadProgress,
        handleUploadError,
        handleUploadSuccess
      );
    } else {
      reset();
    }
  }, [handleUploadSuccess, reset, uploadTask]);

  return {
    isLoading: uploadStatus === 'loading',
    isIdle: uploadStatus === 'idle',
    isError: uploadStatus === 'rejected',
    isSuccess: uploadStatus === 'resolved',
    uploadTask,
    imageUrl,
    uploadStatus,
    percentUploaded,
    uploadError,
    onSubmit
  }
};

export default useUploadImage;