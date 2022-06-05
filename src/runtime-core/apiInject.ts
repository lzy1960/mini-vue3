import { getCurrentInstance } from './component';

export const provide = (key, value) => {
  // 存
  const currentInstance: any = getCurrentInstance()
  if (currentInstance) {
    let { provides } = currentInstance
    const parentProvides = currentInstance.parent.provides

    // init
    if (provides === parentProvides) {
      provides = currentInstance.provides = Object.create(parentProvides)
    }

    provides[key] = value
  }
}

export const inject = (key, defaultValue) => {
  // 取
  const currInstance: any = getCurrentInstance()

  if (currInstance) {
    const parentProvides = currInstance.parent.provides

    if (key in parentProvides) {
      return parentProvides[key]
    } else if (defaultValue) {
      if (typeof defaultValue === 'function') {
        return defaultValue()
      }
      return defaultValue
    }
  }
}
