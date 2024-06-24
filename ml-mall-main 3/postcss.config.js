// postcss.config.js
module.exports = {
  plugins: {
    /**
     * 自动px转rem
     */
    'postcss-pxtorem': {
      // 一个元素是75px   ===>   2rem
      rootValue: 37.5,
      propList: ['*'],
    },
    /**
     * 自动适配浏览器
     */
    'postcss-preset-env': {},
  },
};
