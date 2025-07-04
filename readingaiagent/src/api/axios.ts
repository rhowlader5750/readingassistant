
import axios from 'axios';

export const getSummary = (text: string) => {
  return axios.post('http://localhost:3000/summarize', { text });
};
