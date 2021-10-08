import md5 from 'md5';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';
import { 
  getDatabase,
  set,
  ref,
  push,
  child,
  update,
  onValue,
  off,
  serverTimestamp,
 } from 'firebase/database';
import { 
  getStorage,
  ref as storageRef, 
  uploadBytesResumable, 
  getDownloadURL
} from 'firebase/storage';
import firebaseConfig from './firebaseConfig';

const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getDatabase();
export const storage = getStorage(app);

const dbRef = ref(db);

// Регистрация и вход пользователя
export const registerOrLoginUser = async (userData, operation = 'register') => {
  const { email, password } = userData;

  switch (operation) {
    case 'register':
      return await createUserWithEmailAndPassword(auth, email, password);
    case 'login':
      return await signInWithEmailAndPassword(auth, email, password);
    default:
      throw new Error(`Тип операции ${operation} невозможен`);
  };
};

// Выход пользователя 
export const signOutUser = async () => {
  return await signOut(auth);
};

// Добавление имени и аватара к профилю пользователя
export const addNameAndAvatarToUserProfile = async (userData) => {
  const { username, email } = userData;

  return await updateProfile(auth.currentUser, {
    displayName: username,
    photoURL: `http://gravatar.com/avatar/${md5(email)}?d=identicon`
  });
};

// Сохранение пользователя в базе
export const saveUserToDatabase = async (user) => {
  return await set(ref(db, `users/${user.uid}`), {
    name: user.displayName,
    avatar: user.photoURL
  });
};

// Сохранение данных в базе
export const saveDataToDatabase = async (colName, path, savedData) => {
  const newDataKey = push(child(dbRef, colName)).key;

  if ('id' in savedData && savedData.id === '') {
    savedData.id = newDataKey
  }

  const updates = {
    [`${path}/${newDataKey}`]: savedData
  };

  return await update(dbRef, updates);
};

// Добавление слушателя, который следит за изменениями у детей
export const childAddedListener = (path, callback) => {
  const colRef = ref(db, `${path}`);
  return onValue(colRef, callback);
};

// Удаление всех слушателей
export const removeListeners = (path) => {
  const colRef = ref(db, `${path}`);
  return off(colRef);
};

// Установить наблюдателя за состоянием аутентификации
export const setAuthenticationState = (setUserRoute) => {
  return onAuthStateChanged(auth, setUserRoute);
};

// Время отправки сообщения или файла
export const dispatchTime = serverTimestamp();

// Сохранение медиафайлов в Storage
export const saveMediaFilesToStorage = (filePath, file, metadata) => {
  const refStorage = storageRef(storage, filePath);
  return uploadBytesResumable(refStorage, file, metadata);
};

// Получить ссылку на загруженный в Storage файл
export const getLinkToUploadedFile = async (ref) => {
  return await getDownloadURL(ref);
};
// Установить наблюдателя за состоянием загрузки медиафайлов
export const setMediaUploadProgressWatcher = (uploadTask, progressHandling, errorHandling, successHanding) => {
  return uploadTask.on('state_changed',
    (snapshot) => {
      const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      progressHandling(progress);
    },
    (error) => errorHandling(error),
    () => successHanding(uploadTask.snapshot.ref),
  );
}

export default app;