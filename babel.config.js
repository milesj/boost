/* eslint-disable */

const { HOME } = process.env;
let config = {};

try {
  // This is pretty hacky but we cant install Packemon as a dependency!
  config = require(`${HOME}/.config/yarn/global/node_modules/packemon/lib/babel`).config;
} catch {
  config = require('@milesj/build-tool-config/lib/configs/babel').default;
}

module.exports = config;
