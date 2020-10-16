import axios from 'axios';
import { getGIF } from '../giphyApi';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('src.services.giphyApi.getGIF', (): void => {
  it('Returns empty string if not found', async (): Promise<void> => {
    mockedAxios.get.mockResolvedValue({ data: { data: [] } });

    const gif = await getGIF('some title');
    expect(gif).toBe('');
  });

  it('Returns empty string if not found', async (): Promise<void> => {
    mockedAxios.get.mockResolvedValue({ data: { data: [{ url: 'http://url' }] } });

    const gif = await getGIF('some title');
    expect(gif).toBe('http://url');
  });
});
