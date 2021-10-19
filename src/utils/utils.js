import moment from 'moment';

export const declOfNum = (n, textForms) => {
  n = Math.abs(n) % 100;
  var n1 = n % 10;
  if (n > 10 && n < 20) return textForms.plural;
  if (n1 > 1 && n1 < 5) return textForms.betweenSingAndPlur;
  if (n1 === 1) return textForms.singular;
  return textForms.plural;
};

const requiredText = (placeholder) => `Поле '${placeholder}' обязательно для заполнения`;

export const registerInputsData = watch => [
  {
    name: 'username',
    icon: 'user',
    placeholder: 'Имя пользователя',
    type: 'text',
    validationRules: {
      required: requiredText('Имя пользователя'),
    }
  },
  {
    name: 'email',
    icon: 'mail',
    placeholder: 'Email-адрес',
    type: 'email',
    validationRules: {
      required: requiredText('Email-адрес'),
      pattern: {
        value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
        message: 'Введите корректный email-адрес'
      }
    }
  },
  {
    name: 'password',
    icon: 'lock',
    placeholder: 'Пароль',
    type: 'password',
    validationRules: {
      required: requiredText('Пароль'),
      minLength: {
        value: 6,
        message: 'Пароль должен быть не меньше 6-ти символов'
      }
    }
  },
  {
    name: 'passwordConfirmation',
    icon: 'repeat',
    placeholder: 'Подтверждение пароля',
    type: 'password',
    validationRules: {
      required: requiredText('Подтверждение пароля'),
      validate: (value) => value === watch('password') || 'Пароли не совпадают'
    }
  },
];

export const loginInputsData = [
  {
    name: 'email',
    icon: 'mail',
    placeholder: 'Email-адрес',
    type: 'email',
    validationRules: {
      required: requiredText('Email-адрес'),
      pattern: {
        value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
        message: 'Введите корректный email-адрес'
      }
    }
  },
  {
    name: 'password',
    icon: 'lock',
    placeholder: 'Пароль',
    type: 'password',
    validationRules: {
      required: requiredText('Пароль'),
      minLength: {
        value: 6,
        message: 'Пароль должен быть не меньше 6-ти символов'
      }
    }
  },
];

export const addChannelInputsData = [
  {
    name: 'channelName',
    label: 'Название канала',
    validationRules: {
      required: requiredText('Название канала'),
    }
  },
  {
    name: 'channelDetails',
    label: 'Описание канала',
    validationRules: {
      required: requiredText('Описание канала'),
    }
  },
];

export const createMessageData = (userData, dispatchTime, message = null, fileURL = null) => {
  const messageData = {
    timestamp: dispatchTime,
    user: {
      id: userData.uid,
      name: userData.displayName,
      avatar: userData.photoURL
    },
  };

  if (fileURL !== null) {
    messageData.image = fileURL;
  } else {
    messageData.content = message;
  }

  return messageData;
};

const allowedImageTypes = [
  'image/jpeg',
  'image/png',
  'image/jpg'
];

export const validateUploadImageRules = {
  lessThan5MB: files => files[0].size < 5000000 || `Максимальный размер файла 5 MB, сейчас ${Math.abs(files[0]?.size / 1000)} MB`,
  acceptedFormats: files =>
    allowedImageTypes.includes(
      files[0].type
    ) || 'Можно загружать только файлы в формате .jpg, .png или .jpeg',
};

export const isImage = (message) => {
  return Object.keys(message).includes('image') && !Object.keys(message).includes('content');
};

export const timeFromNow = (timestamp) => {
  return moment(timestamp).fromNow();
};

export const isOwnMessage = (message, user) => message.user.id === user.uid;
