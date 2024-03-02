import axios from 'axios';
const apiUrl = 'http://localhost:3000/api/sign';

export type IPostSignProps = {
  creator: string;
  content: string;
  limit: Date;
};
export const postSign = async (props: IPostSignProps) => {
  return await axios.post(apiUrl + '/postSign', props);
};

export const check_in = async (props: { qid: string; uid: string }) => {
  return await axios.post(apiUrl + '/check-in', props);
};

export const getNewSign = async (props: {
  cid: string;
  currentPage?: number;
  singleTotal?: number;
}) => {
  return await axios.get(apiUrl + '/getNewSign', {
    params: props,
  });
};

export const getSignMessage = async (props: { qid: string }) => {
  return await axios.get(apiUrl + '/getSignMessage', {
    params: props,
  });
};
