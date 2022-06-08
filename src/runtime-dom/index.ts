import { createRenderer } from '../runtime-core';

export const createElement = (type) => {
  return document.createElement(type)
}

export const patchProp = (el, key, prevVal, nextVal) => {
  const isOn = (key: string) => /^on[A-Z]/.test(key)
  if (isOn(key)) {
    const event = key.slice(2).toLowerCase()
    el.addEventListener(event, nextVal)
  } else {
    if (nextVal === undefined || nextVal === null) {
      el.removeAttribute(key)
    } else {
      el.setAttribute(key, Array.isArray(nextVal) ? nextVal.join(' ') : nextVal)
    }
  }
}

export const insert = (el, parent) => {
  parent.append(el)
}

export const remove = (child) => {
  const parent = child.parentNode
  parent.removeChild(child)
}

function setElementText (el, text) {
  el.textContent = text
}

const renderer: any = createRenderer({
  createElement,
  patchProp,
  insert,
  remove,
  setElementText
})

export const createApp = (...args) => {
  return renderer.createApp(...args)
}

export * from '../runtime-core';
