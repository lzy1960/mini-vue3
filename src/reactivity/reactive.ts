import { track, trigger } from './effect';
import { mutibleHandlers, ReactiveFlags, readonlyHandlers } from './baseHandlers';

export const reactive = (raw) => {
  return new Proxy(raw, mutibleHandlers)
};

export const readonly = (raw) => {
  return createActiveObject(raw, readonlyHandlers)
};

export const isReactive = (value) => {
  return !!value[ReactiveFlags.IS_REACTIVE]
};

export const isReadonly = (value) => {
  return !!value[ReactiveFlags.IS_READONLY]
};

function createActiveObject (raw: any, baseHandlers) {
  return new Proxy(raw, baseHandlers);
}

