export const extend = Object.assign

export const isObject = (val) => {
  return val !== null && typeof val === 'object'
};

export const hasChanged = (val, newValue) => {
  return !Object.is(newValue, val)
};

export const hasOwn = (val, key) => key in val
