import { ReactiveEffect } from '../reactivity/effect';

export const watchEffect = (effect) => {
  doWatch(effect)
}

export const doWatch = (source) => {
  const effect = new ReactiveEffect(source)
  effect.run()
}
