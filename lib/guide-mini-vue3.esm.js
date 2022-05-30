const createVNode = (type, props, children) => {
    const vnode = {
        type,
        props,
        children
    };
    return vnode;
};

function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type
    };
    return component;
}
const setupConponent = (instance) => {
    // TODO:
    // initProps
    // initSlots
    setupStatefulComponent(instance);
};
function setupStatefulComponent(instance) {
    const component = instance.type;
    const { setup } = component;
    if (setup) {
        const setupResult = setup();
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult) {
    // function object
    // TODO: function
    if (typeof setupResult === 'object') {
        instance.setupState = setupResult;
    }
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    const component = instance.type;
    // 假设用户必须写render
    instance.render = component.render;
}

const isObject = (val) => {
    return val !== null && typeof val === 'object';
};

const render = (vnode, container) => {
    patch(vnode);
};
const patch = (vnode, container) => {
    // 处理组件
    // TODO:
    // 判断是不是element
    if (isObject(vnode.type)) ;
    processComponent(vnode);
};
function processComponent(vnode, container) {
    mountComponent(vnode);
}
function mountComponent(vnode, container) {
    const instance = createComponentInstance(vnode);
    setupConponent(instance);
    setupRenderEffect(instance);
}
function setupRenderEffect(instance, container) {
    const subTree = instance.render();
    // vnode -> patch
    // vnode -> element -> mountElement
    patch(subTree);
}

// 整体流程
// createApp -> app.mount() -> 
// render -> patch -> 判断vnode类型 ->
// 如果是component -> mountComponent -> setupComponent+setupRenderEffect
const createApp = (rootComponent) => {
    return {
        mount(rootContainer) {
            // 先转化成 vnode
            // 所有的逻辑操作都会基于 vnode
            const vnode = createVNode(rootComponent);
            render(vnode);
        }
    };
};

const h = (type, props, children) => {
    return createVNode(type, props, children);
};

export { createApp, h };
