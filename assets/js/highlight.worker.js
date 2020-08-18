import hljs from 'highlight.js';

onmessage = (event) => {
  const { index, content } = event.data;

  const result = hljs.highlightAuto(content);
  postMessage({ index, html: result.value });
};
