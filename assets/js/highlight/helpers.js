export const init = async (languages) => {
  const { default: hljs } = await import(
    /* webpackChunkName: "highlight.js/lib/core" */
    'highlight.js/lib/core'
  );

  hljs.configure({ languages: [] });
  await Promise.all(languages.map(registerLanguage(hljs)));

  hljs.initHighlighting();
};

const registerLanguage = (hljs) => async (langStr) => {
  const { default: lang } = await import(
    /* webpackChunkName: "highlight.js/lib/languages/[request]" */
    `highlight.js/lib/languages/${langStr}`
  );

  hljs.registerLanguage(langStr, lang);
};
