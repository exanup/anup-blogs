export const doubleRaf = (callback, context = null) => (...args) =>
  requestAnimationFrame(() =>
    requestAnimationFrame(() => callback.apply(context, args))
  );
