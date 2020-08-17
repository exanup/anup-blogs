export const doubleRaf = (callback, context = null) => (...args) =>
  requestAnimationFrame(() =>
    requestAnimationFrame(() => callback.apply(context, args))
  );

export const nextTick = (callback, context = null) => (...args) =>
  setTimeout(() => callback.apply(context, args), 0);
