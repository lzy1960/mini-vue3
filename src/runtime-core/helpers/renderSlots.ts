import { createVNode, Fragment } from '../vnode';

export const renderSlots = (slots, name, props) => {
  const slot = slots[name]

  if (slot) {
    // slot是个function
    if (typeof slot === 'function')
      return createVNode(Fragment, {}, slot(props))
  }
}