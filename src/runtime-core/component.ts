import { PublicInstanceProxyHandlers } from './componentPublicInstance';
export function createComponentInstance (vnode) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
    el: null
  }

  return component
}

export const setupConponent = (instance) => {
  // TODO:
  // initProps
  // initSlots

  setupStatefulComponent(instance)
};

function setupStatefulComponent (instance: any) {
  const component = instance.type

  // ctx
  instance.proxy = new Proxy(
    { _: instance },
    PublicInstanceProxyHandlers
  )

  const { setup } = component

  if (setup) {
    const setupResult = setup()
    handleSetupResult(instance, setupResult)
  }
}

function handleSetupResult (instance: any, setupResult: any) {
  // function object
  // TODO: function
  if (typeof setupResult === 'object') {
    instance.setupState = setupResult
  }

  finishComponentSetup(instance)
}

function finishComponentSetup (instance: any) {
  const component = instance.type

  // 假设用户必须写render
  instance.render = component.render
}
