import { extend } from '../shared/index';


let activeEffect
let shouldTrack = false

class ReactiveEffect {
  private _fn
  deps = []
  active = true
  public scheduler?: Function | undefined
  public onStop?: Function | undefined

  constructor(fn, scheduler?: Function) {
    this._fn = fn
    this.scheduler = scheduler
  }

  run () {
    activeEffect = this
    shouldTrack = true
    const fn = this._fn()
    shouldTrack = false
    return fn
  }

  stop () {
    if (this.active) {
      cleanupEffect(this)
      if (this.onStop) {
        this.onStop()
      }
      this.active = false
    }
  }
}

function cleanupEffect (effect) {
  effect.deps.forEach(dep => {
    dep.delete(effect)
  });
  effect.deps.length = 0
}

const targetMap = new Map()
export const track = (target, key) => {
  if (!isTracking()) return

  // target -> key -> dep
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }

  let dep = depsMap.get(key)
  if (!dep) {
    dep = new Set()
    depsMap.set(key, dep)
  }

  if (isTracking()) {
    trackEffects(dep)
  }
}

export const trackEffects = (dep) => {
  if (dep.has(activeEffect)) return
  dep.add(activeEffect)
  activeEffect.deps.push(dep)
};


export const isTracking = () => {
  return shouldTrack && activeEffect !== undefined
}

export const trigger = (target, key) => {
  let depsMap = targetMap.get(target)
  let dep = depsMap.get(key)

  triggerEffect(dep)
}

export const triggerEffect = (dep) => {
  for (const effect of dep) {
    if (effect.scheduler) {
      effect.scheduler()
    } else {
      effect.run()
    }
  }
};


export const effect = (fn, options = {}) => {
  const _effect = new ReactiveEffect(fn, options.scheduler)
  extend(_effect, options)

  _effect.run()

  const runner = _effect.run.bind(_effect)
  runner.effect = _effect

  return runner
}

export const stop = (runner) => {
  runner.effect.stop()
};
