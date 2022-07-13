import { track, trigger } from './effect';
import { mutableHandlers, ReactiveFlags, readonlyHandlers, shallowReactiveHandlers, shallowReadonlyHandlers } from './baseHandlers';

export const reactive = (raw) => {
  return new Proxy(raw, mutableHandlers)
};

export const readonly = (raw) => {
  return createActiveObject(raw, readonlyHandlers)
};

export const shallowReadonly = (raw) => {
  return createActiveObject(raw, shallowReadonlyHandlers)
};

export const shallowReactive = (raw) => {
  return createActiveObject(raw, shallowReactiveHandlers)
}

export const isReactive = (value) => {
  return !!value[ReactiveFlags.IS_REACTIVE]
};

export const isReadonly = (value) => {
  return !!value[ReactiveFlags.IS_READONLY]
};

export const isProxy = (value) => {
  return isReadonly(value) || isReactive(value)
};

export const toRaw = (observed) => {
  const raw = observed && observed[ReactiveFlags.RAW]
  return raw ? toRaw(raw) : observed
}

function createActiveObject (raw: any, baseHandlers) {
  return new Proxy(raw, baseHandlers);
}

