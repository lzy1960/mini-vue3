import { trigger, track } from './effect';
import { reactive, readonly } from './reactive';
import { isObject, extend } from '../shared/index';

const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)
const shallowReadonlyGet = createGetter(true, true)

export const enum ReactiveFlags {
  IS_REACTIVE = 'is_reactive',
  IS_READONLY = 'is_readonly',
  RAW = "raw"
}

function createGetter (isReadonly = false, isShallow = false) {
  return function get (target, key) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    } else if (key === ReactiveFlags.RAW) {
      return target
    }

    const res = Reflect.get(target, key)

    if (isShallow) return res

    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res)
    }

    if (!isReadonly) {
      track(target, key)
    }

    return res
  }
}
function createSetter () {
  return function set (target, key, value) {
    const res = Reflect.set(target, key, value)
    trigger(target, key)

    return res
  }
}

export const mutibleHandlers = {
  get,
  set
}

export const readonlyHandlers = {
  get: readonlyGet,
  set (target, key, value) {
    console.warn('readonly cannot be change')
    return true
  }
};

export const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
  get: shallowReadonlyGet
})
