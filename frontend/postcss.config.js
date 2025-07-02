import tailwindcssNesting from 'tailwindcss/nesting/index.js';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import postcssImport from 'postcss-import';
import postcssPresetEnv from 'postcss-preset-env';
import postcssCustomMedia from 'postcss-custom-media';
import postcssColorFunction from 'postcss-color-function';
import postcssReporter from 'postcss-reporter';

export default {
  plugins: [
    postcssImport(),
    tailwindcssNesting(),
    tailwindcss(),
    autoprefixer(),
    postcssPresetEnv({
      stage: 1,
      features: {
        'nesting-rules': false, // handled by tailwindcss/nesting
        'custom-media-queries': true,
        'color-function': { unresolved: 'warn' },
      },
      autoprefixer: { grid: true },
    }),
    postcssCustomMedia(),
    postcssColorFunction(),
    postcssReporter({ clearReportedMessages: true }),
  ],
  map: process.env.NODE_ENV !== 'production',
};