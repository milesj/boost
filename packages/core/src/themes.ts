/**
 * @copyright   2017-2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import { ColorPalette } from './types';

const themes: { [theme: string]: ColorPalette } = {
  // https://draculatheme.com/atom/
  dracula: {
    default: '#f8f8f2',
    failure: '#ff5555',
    pending: '#999999',
    success: '#50fa7b',
    warning: '#f1fa8c',
  },
  // https://atom.io/themes/dark-side-of-the-moon-syntax
  'moon-dark': {
    default: '#E2E2E2',
    failure: '#e88147',
    pending: '#83abbd',
    success: '#bf67d9',
    warning: '#fbb71b',
  },
  // https://atom.io/themes/far-side-of-the-moon-syntax
  'moon-light': {
    default: '#5b6775',
    failure: '#dd6f38',
    pending: '#a1a1a1',
    success: '#5c9f50',
    warning: '#00b4cb',
  },
  // https://github.com/atom/one-dark-ui
  'one-dark': {
    default: '#dde1f6',
    failure: '#E06C75',
    pending: '#ABB2BF',
    success: '#98C379',
    warning: '#D19A66',
  },
  // https://github.com/atom/one-light-ui
  'one-light': {
    default: '#383b42',
    failure: '#E45649',
    pending: '#ABB2BF',
    success: '#50A14F',
    warning: '#986801',
  },
  // http://ethanschoonover.com/solarized
  solarized: {
    default: '#eee8d5',
    failure: '#dc322f',
    pending: '#93a1a1',
    success: '#859900',
    warning: '#b58900',
  },
};

export default themes;
