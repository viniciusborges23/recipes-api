import axios from 'axios';

const { GIPHY_API_KEY } = process.env;

const giphyApi = axios.create({
  baseURL: 'https://api.giphy.com/v1/gifs/',
});

export async function getGIF(title: string) {
  let gif = '';

  try {
    const { data: { data } } = await giphyApi.get(`search?api_key=${GIPHY_API_KEY}&q=${title}&limit=1&lang=en`);

    gif = data[0]?.url || '';
  } catch (e) {
    // noop
  }

  return gif;
}

export default giphyApi;
