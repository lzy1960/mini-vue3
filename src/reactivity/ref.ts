import { trackEffects, triggerEffect, isTracking } from './effect';
import { hasChanged, isObject } from '../shared/index';
import { reactive } from './reactive';
class RefImpl {
  private _value
  public dep
  private _rawValue

  constructor(value) {
    this._rawValue = value
    this._value = convert(value)
    this.dep = new Set()
  }

  get value () {
    trackRefValue(this)
    return this._value
  }

  set value (newValue) {
    if (hasChanged(this._rawValue, newValue)) {
      this._rawValue = newValue
      this._value = convert(newValue)
      triggerEffect(this.dep)
    }
  }
}

function convert (value) {
  return isObject(value) ? reactive(value) : value
}

function trackRefValue (ref) {
  if (isTracking()) {
    trackEffects(ref.dep)
  }
}

export const ref = (value) => {
  return new RefImpl(value)
};
