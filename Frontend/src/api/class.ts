import axios from 'axios';
const apiUrl = 'http://localhost:3000/api/class';

export const getAllClass = async () => {
  return await axios.get(apiUrl + '/getAllClass');
};

export const createClass = async (content: string) => {
  return await axios.post(apiUrl + '/createClass', { content });
};

export const editClassName = async (data: { content: string; _id: string }) => {
  return await axios.post(apiUrl + '/editClassName', data);
};

export const deleteClass = async (data: { cid: string }) => {
  return await axios.delete(apiUrl + '/deleteClass', { data });
};

export const getUsersByClassId = async (data: { cid: string }) => {
  return await axios.get(apiUrl + '/getUsersByClassId', {
    params: data,
  });
};
