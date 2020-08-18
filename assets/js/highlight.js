import { doubleRaf, nextTick } from './utils';

const init = async () => {
  const HighlightWorker = await import(
    /* webpackChunkName: "highlight-worker" */
    './highlight.worker'
  ).then((module) => module.default);

  const blocks = document.querySelectorAll('pre code');

  const updateBlock = (index, html) => {
    blocks[index].innerHTML = html;
  };

  const worker = new HighlightWorker();

  worker.onmessage = (event) => {
    const { index, html } = event.data;

    doubleRaf(updateBlock)(index, html);
  };

  blocks.forEach((code, index) => {
    worker.postMessage({ index, content: code.textContent });
  });
};

window.addEventListener('DOMContentLoaded', nextTick(init), false);
