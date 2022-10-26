import { defineConfig } from 'umi';

export default defineConfig({
  layout: {},
  proxy: {
    '/api': {
      target: 'http://localhost:9050',
    },
  },
  mock: {
    exclude: [
      '/api/songs/play_list/',
      '/api/song/play_list/add',
      '/api/movie/search',
    ],
  },
  history: {
    type: 'hash',
  },
  hash: true,
});
