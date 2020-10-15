import axios from 'axios';

const recipePubbyApi = axios.create({
  baseURL: 'http://www.recipepuppy.com/api/',
});

export default recipePubbyApi;
