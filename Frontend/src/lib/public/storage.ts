import { IHomeState } from '../../settings/homeState';

export const setUserData = (data: IHomeState) => {
  const key = 'userData';
  sessionStorage.setItem(key, JSON.stringify(data));
};

export const getUserData = () => {
  if (typeof window !== 'undefined') {
    const key = 'userData';
    const encryptedData = sessionStorage.getItem(key);
    if (encryptedData) {
      return JSON.parse(encryptedData);
    }
  }

  return null;
};

export const clearSessionKey = () => {
  const key = 'userData';
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(key);
  }
};
