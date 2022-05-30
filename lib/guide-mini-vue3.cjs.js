'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

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
    patch(vnode, container);
};
const patch = (vnode, container) => {
    // 处理组件
    // TODO:
    // 判断是不是element =>
    if (typeof vnode.type === 'string') {
        processElement(vnode, container);
    }
    else if (isObject(vnode.type)) {
        processComponent(vnode, container);
    }
};
function processElement(vnode, container) {
    mountElement(vnode, container);
}
function processComponent(vnode, container) {
    mountComponent(vnode, container);
}
function mountElement(vnode, container) {
    // string array
    const { props, children } = vnode;
    const el = document.createElement(vnode.type);
    if (typeof children === 'string') {
        el.textContent = children;
    }
    else if (Array.isArray(children)) {
        mountChildren(children, el);
    }
    for (const key in props) {
        const val = props[key];
        el.setAttribute(key, Array.isArray(val) ? val.join(' ') : val);
    }
    container.append(el);
}
function mountComponent(vnode, container) {
    const instance = createComponentInstance(vnode);
    setupConponent(instance);
    setupRenderEffect(instance, container);
}
function setupRenderEffect(instance, container) {
    const subTree = instance.render();
    // vnode -> patch
    // vnode -> element -> mountElement
    patch(subTree, container);
}
function mountChildren(vnode, container) {
    vnode.forEach(child => {
        patch(child, container);
    });
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
            render(vnode, rootContainer);
        }
    };
};

const h = (type, props, children) => {
    return createVNode(type, props, children);
};

exports.createApp = createApp;
exports.h = h;
