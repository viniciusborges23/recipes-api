import axios from 'axios';

const { GIPHY_API_KEY } = process.env;

const baseURL = 'https://api.giphy.com/v1/gifs/';

export async function getGIF(title: string) {
  let gif = '';

  try {
    const { data: { data } } = await axios.get(`${baseURL}search?api_key=${GIPHY_API_KEY}&q=${title}&limit=1&lang=en`);

    gif = data[0]?.url || '';
  } catch (e) {
    // noop
  }

  return gif;
}

export default {
  getGIF,
};
