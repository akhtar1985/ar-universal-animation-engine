const isDev = typeof process === 'undefined' || process.env?.NODE_ENV !== 'production';

export const warn  = isDev ? (msg, ...args) => console.warn(`UAE: ${msg}`, ...args)  : () => {};
export const error = isDev ? (msg, ...args) => console.error(`UAE: ${msg}`, ...args) : () => {};
