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
  onDisconnect,
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
export const storage = getStorage();

const dbRef = ref(db);
const usersRef = ref(db, 'users');

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
    uid: user.uid,
    name: user.displayName,
    avatar: user.photoURL,
    status: '',
  });
};

// Сохранение данных в базе
export const saveDataToDatabase = async (colName, savedData) => {
  const dataKey = push(child(dbRef, colName)).key;

  if ('id' in savedData && savedData.id === '') {
    savedData.id = dataKey
  }

  return await set(ref(db, `${colName}/${dataKey}`), savedData);
};

// Получение данных в реальном времени
export const getDataInRealTime = (path, callback) => {
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
  const imagesRef = storageRef(storage, filePath);
  return uploadBytesResumable(imagesRef, file, metadata);
};

// Получить ссылку на загруженный в Storage файл
export const getLinkToUploadedFile = async (ref) => {
  return await getDownloadURL(ref);
};
// Слушатель состояния загрузки файала
export const setMediaUploadProgressWatcher = (uploadTask, progressHandling, errorHandling, successHanding) => {
  return uploadTask.on('state_changed',
    (snapshot) => {
      const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      progressHandling(progress);
    },
    (error) => errorHandling(error),
    () => successHanding(uploadTask.snapshot.ref),
  );
};

// Определение статуса пользователя: в онлайне или в оффлайне
export const statusUser = (user) => {
  const path = `users/${user.uid}`;
  const myConnectionsRef = ref(db, `${path}/connections`);

  // stores the timestamp of my last disconnect (the last time I was seen online)
  const lastOnlineRef = ref(db, `${path}/lastOnline`);

  const connectedRef = ref(db, '.info/connected');
  onValue(connectedRef, (snap) => {
    if (snap.val() === true) {
      const con = push(myConnectionsRef);
      user.status = 'online'
      onDisconnect(con).remove();
      set(con, true);
      onDisconnect(lastOnlineRef).set(serverTimestamp());
    } else {
      user.status = 'offline'
    }
    return update(usersRef, user);
  });
};


export default app;