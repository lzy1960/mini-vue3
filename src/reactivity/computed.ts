import { ReactiveEffect } from './effect';

class ComputedRefImpl {
  private _dirty = true
  private _value
  private _effect
  constructor(getter) {
    this._effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true
      }
    })
  }
  get value () {
    // get value -> dirty true
    // 当依赖的响应式对象发生改变的时候
    // effect
    if (this._dirty) {
      this._dirty = false
      this._value = this._effect.run()
    }
    return this._value
  }
}

export const computed = (getter) => {
  return new ComputedRefImpl(getter)
};
