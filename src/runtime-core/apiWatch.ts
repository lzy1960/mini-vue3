import { ReactiveEffect } from '../reactivity/effect';
import { isFunction } from '../shared';
import { hasChanged } from '../shared/index';
import { isRef } from '../reactivity/ref';

export const watchEffect = (effect) => {
  doWatch(effect, null)
}

export const watch = (source, cb) => {
  doWatch(source, cb)
}

const INITIAL_WATCHER_VALUE = {}
export const doWatch = (source, cb) => {
  let getter
  if (isFunction(source)) {
    getter = () => source()
  } else if (isRef(source)) {
    getter = () => source.value
  }

  let scheduler = () => job()
  const effect = new ReactiveEffect(getter, scheduler)

  let oldValue = INITIAL_WATCHER_VALUE
  const job = () => {
    if (!effect.active) {
      return
    }
    if (cb) {
      const newValue = effect.run()
      if (hasChanged(oldValue, newValue)) {
        cb(newValue, oldValue)
        oldValue = newValue
      }
    } else {
      effect.run()
    }
  }

  if (cb) {
    oldValue = effect.run()
  } else {
    effect.run()
  }
}
