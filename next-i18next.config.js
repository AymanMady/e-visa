module.exports = {
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en', 'ar'],
  },
  localePath: typeof window === 'undefined' ? require('path').resolve('./public/locales') : '/locales',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
};