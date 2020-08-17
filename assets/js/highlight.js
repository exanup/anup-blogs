import { doubleRaf, nextTick } from './utils';

const init = async () => {
  const { default: hljs } = await import(
    /* webpackPreload: true */
    /* webpackChunkName: "highlight.js" */
    'highlight.js'
  );

  doubleRaf(hljs.initHighlighting)();
};

window.addEventListener('DOMContentLoaded', nextTick(init), false);
