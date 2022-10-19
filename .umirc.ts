import { defineConfig } from 'umi';

export default defineConfig({
  layout: {},
  proxy: {
    '/api': {
      target: 'http://localhost:9050',
    },
  },
  mock: {
    exclude: ['/api/songs/play_list/'],
  },
});
