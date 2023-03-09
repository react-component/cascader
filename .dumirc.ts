import { defineConfig } from 'dumi';

const name = 'cascader'

const isProdSite =
  // 不是预览模式 同时是生产环境
  process.env.PREVIEW !== 'true' && process.env.NODE_ENV === 'production';

export default defineConfig({
  favicons: ['https://avatars0.githubusercontent.com/u/9441414?s=200&v=4'],
  themeConfig: {
    name,
    logo: 'https://avatars0.githubusercontent.com/u/9441414?s=200&v=4',
  },
  base: isProdSite ? `/${name}/` : '/',
  outputPath: '.doc',
  publicPath: isProdSite ? `/${name}/` : '/',
});
