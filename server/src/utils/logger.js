// Simple logger utility: logs only in development
const log = (...args) => {
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.log(...args);
  }
};

const error = (...args) => {
  // Always log errors
  // eslint-disable-next-line no-console
  console.error(...args);
};

module.exports = { log, error };
