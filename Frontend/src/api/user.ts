import axios from 'axios';
import { IHomePermission } from '../settings/homeState';
const apiUrl = 'http://localhost:3000/api/user';

export type IGoRegisterProps = {
  user_name: string;
  password: string;
  permission: IHomePermission;
};
export const goRegister = async (props: IGoRegisterProps) => {
  return await axios.post(apiUrl + '/register', props);
};

export const goLogin = async (props: {
  user_name: string;
  password: string;
}) => {
  return await axios.post(apiUrl + '/login', props);
};

export const getAllUser = async (props: {
  currentPage?: number;
  singleTotal?: number;
}) => {
  return await axios.get(apiUrl + '/getAllUser', {
    params: props,
  });
};

export const editUserClass = async (props: {
  uid: string;
  cid: string;
  oldCid?: string;
}) => {
  return await axios.post(apiUrl + '/editUserClass', props);
};
