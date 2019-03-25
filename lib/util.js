'use strict';

const isString = (property) => {
  if (typeof property === 'string' || property instanceof String)
    return true;

  return false;
};

module.exports = {
  isString
};
