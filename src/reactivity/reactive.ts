import { track, trigger } from './effect';
import { mutibleHandlers, readonlyHandlers } from './baseHandlers';

export const reactive = (raw) => {
  return new Proxy(raw, mutibleHandlers)
};

export const readonly = (raw) => {
  return createActiveObject(raw, readonlyHandlers)
};
function createActiveObject (raw: any, baseHandlers) {
  return new Proxy(raw, baseHandlers);
}

