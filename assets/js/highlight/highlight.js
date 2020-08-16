import { doubleRaf } from '../utils';
import { init } from './helpers';
import { languages } from './languages';

const initLazy = () => doubleRaf(init)(languages);

window.addEventListener('DOMContentLoaded', initLazy, false);
