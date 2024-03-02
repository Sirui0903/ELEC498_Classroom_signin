import axios from 'axios';
const apiUrl = 'http://localhost:3000/api/class';

export const getAllClass = async () => {
  return await axios.get(apiUrl + '/getAllClass');
};

export const createClass = async (content: string) => {
  return await axios.post(apiUrl + '/createClass', { content });
};
