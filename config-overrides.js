const webpack = require('webpack');

module.exports = function override(config) {
  // Add fallbacks for node modules
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "stream": require.resolve("stream-browserify"),
    "url": require.resolve("url/"),
    "http": require.resolve("stream-http"),
    "https": require.resolve("https-browserify")
  };
  
  return config;
};