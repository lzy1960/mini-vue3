import { ShapeFlags } from "../shared/ShapeFlags"

export const initSlots = (instance, children) => {
  // 具名插槽，插槽children是个对象
  const { vnode } = instance
  if (vnode.shapeFlag & ShapeFlags.SLOT_CHILDREN) {
    normalizeObjectSlots(children, instance.slots)
  }
}

function normalizeObjectSlots (children, slots) {
  for (const key in children) {
    const slot = children[key]
    slots[key] = (props) => normalizeSlotValue(slot(props))
  }
}

function normalizeSlotValue (value) {
  return Array.isArray(value) ? value : [value]
}
