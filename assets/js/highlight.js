import { doubleRaf, nextTick } from './utils';

const init = async () => {
  const Worker = await import(
    /* webpackChunkName: "worker-loader" */
    './main.worker'
  ).then((module) => module.default);

  const blocks = document.querySelectorAll('pre code');

  const updateBlock = (index, html) => {
    blocks[index].innerHTML = html;
  };

  const worker = new Worker();

  worker.onmessage = (event) => {
    const { index, html } = event.data;

    doubleRaf(updateBlock)(index, html);
  };

  blocks.forEach((code, index) => {
    worker.postMessage({ index, content: code.textContent });
  });
};

window.addEventListener('DOMContentLoaded', nextTick(init), false);
