'use strict';

const isString = (property) => {
  return typeof property === 'string' || property instanceof String;
};

module.exports = {
  isString
};
