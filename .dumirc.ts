import { defineConfig } from 'dumi';
import path from 'path';

// test
export default defineConfig({
  alias: {
    'rc-cascader$': path.resolve('src'),
    'rc-cascader/es': path.resolve('src'),
  },
  favicons: ['https://avatars0.githubusercontent.com/u/9441414?s=200&v=4'],
  themeConfig: {
    name: 'Cascader',
    logo: 'https://avatars0.githubusercontent.com/u/9441414?s=200&v=4',
  },
});
