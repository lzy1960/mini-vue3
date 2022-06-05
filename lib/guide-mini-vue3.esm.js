const extend = Object.assign;
const isObject = (val) => {
    return val !== null && typeof val === 'object';
};
const hasOwn = (val, key) => key in val;
// add-foo -> addFoo
const camelize = (str) => {
    return str.replace(/-(\w)/g, (_, c) => {
        return c ? c.toUpperCase() : '';
    });
};
// add -> Add
const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
// add -> onAdd
const toHandlerKey = (str) => {
    return str ? 'on' + capitalize(str) : '';
};

const Fragment = Symbol('Fragment');
const Text = Symbol('Text');
const createVNode = (type, props, children) => {
    const vnode = {
        type,
        props,
        children,
        shapeFlag: getShapeFlag(type),
        el: null,
    };
    // children
    if (typeof children === 'string') {
        vnode.shapeFlag |= 4 /* TEXT_CHILDREN */;
    }
    else if (Array.isArray(children)) {
        vnode.shapeFlag |= 8 /* ARRAY_CHILDREN */;
    }
    // 组件 + children is object 则为slot
    if (vnode.shapeFlag & 2 /* STATEFUL_COMPONENT */) {
        if (isObject(children)) {
            vnode.shapeFlag |= 16 /* SLOT_CHILDREN */;
        }
    }
    return vnode;
};
const createTextVNode = (text) => {
    return createVNode(Text, {}, text);
};
function getShapeFlag(type) {
    return typeof type === 'string'
        ? 1 /* ELEMENT */
        : 2 /* STATEFUL_COMPONENT */;
}

const publicPropertiesMap = {
    $el: (i) => i.vnode.el,
    $slots: (i) => i.slots,
};
const PublicInstanceProxyHandlers = {
    get({ _: instance }, key) {
        // setupState
        const { setupState, props } = instance;
        if (hasOwn(setupState, key)) {
            return setupState[key];
        }
        else if (hasOwn(props, key)) {
            return props[key];
        }
        if (key === '$el') {
            return instance.vnode.el;
        }
        const publicGetter = publicPropertiesMap[key];
        if (publicGetter) {
            return publicGetter(instance);
        }
    }
};

const initProps = (instance, rawProps) => {
    instance.props = rawProps || {};
};

const targetMap = new Map();
const trigger = (target, key) => {
    let depsMap = targetMap.get(target);
    let dep = depsMap.get(key);
    triggerEffect(dep);
};
const triggerEffect = (dep) => {
    for (const effect of dep) {
        if (effect.scheduler) {
            effect.scheduler();
        }
        else {
            effect.run();
        }
    }
};

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);
function createGetter(isReadonly = false, isShallow = false) {
    return function get(target, key) {
        if (key === "is_reactive" /* IS_REACTIVE */) {
            return !isReadonly;
        }
        else if (key === "is_readonly" /* IS_READONLY */) {
            return isReadonly;
        }
        const res = Reflect.get(target, key);
        if (isShallow)
            return res;
        if (isObject(res)) {
            return isReadonly ? readonly(res) : reactive(res);
        }
        return res;
    };
}
function createSetter() {
    return function set(target, key, value) {
        const res = Reflect.set(target, key, value);
        trigger(target, key);
        return res;
    };
}
const mutibleHandlers = {
    get,
    set
};
const readonlyHandlers = {
    get: readonlyGet,
    set(target, key, value) {
        console.warn('readonly cannot be change');
        return true;
    }
};
const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
    get: shallowReadonlyGet
});

const reactive = (raw) => {
    return new Proxy(raw, mutibleHandlers);
};
const readonly = (raw) => {
    return createActiveObject(raw, readonlyHandlers);
};
const shallowReadonly = (raw) => {
    return createActiveObject(raw, shallowReadonlyHandlers);
};
function createActiveObject(raw, baseHandlers) {
    return new Proxy(raw, baseHandlers);
}

const emit = (instance, event, ...args) => {
    console.log('emit', event);
    // instance.props -> event
    const { props } = instance;
    // TPP
    // 先写一个特定的行为 -> 重构为通用的行为
    const handlerName = toHandlerKey(camelize(event));
    const handler = props[handlerName];
    handler && handler(...args);
};

const initSlots = (instance, children) => {
    // 具名插槽，插槽children是个对象
    const { vnode } = instance;
    if (vnode.shapeFlag & 16 /* SLOT_CHILDREN */) {
        normalizeObjectSlots(children, instance.slots);
    }
};
function normalizeObjectSlots(children, slots) {
    for (const key in children) {
        const slot = children[key];
        slots[key] = (props) => normalizeSlotValue(slot(props));
    }
}
function normalizeSlotValue(value) {
    return Array.isArray(value) ? value : [value];
}

function createComponentInstance(vnode, parent) {
    console.log('createComponentInstance', parent);
    const component = {
        vnode,
        type: vnode.type,
        setupState: {},
        props: {},
        slots: {},
        provides: parent ? parent.provides : {},
        parent,
        emit: () => { }
    };
    component.emit = emit.bind(null, component);
    return component;
}
const setupComponent = (instance) => {
    initProps(instance, instance.vnode.props);
    initSlots(instance, instance.vnode.children);
    setupStatefulComponent(instance);
};
function setupStatefulComponent(instance) {
    const component = instance.type;
    // ctx
    instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers);
    const { setup } = component;
    if (setup) {
        setCurrentInstance(instance);
        const setupResult = setup(shallowReadonly(instance.props), {
            emit: instance.emit
        });
        handleSetupResult(instance, setupResult);
        setCurrentInstance(null);
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
let currentInstance = null;
const setCurrentInstance = (instance) => {
    currentInstance = instance;
};
const getCurrentInstance = () => {
    return currentInstance;
};

const render = (vnode, container, parentComponent) => {
    patch(vnode, container, parentComponent);
};
const patch = (vnode, container, parentComponent) => {
    //ShapeFlags 
    // vnode -> flag
    // 判断是不是element
    const { type, shapeFlag } = vnode;
    // Fragment -> 只渲染所有的children
    switch (type) {
        case Fragment:
            processFragment(vnode, container, parentComponent);
            break;
        case Text:
            processText(vnode, container);
            break;
        default:
            if (shapeFlag & 1 /* ELEMENT */) {
                processElement(vnode, container, parentComponent);
            }
            else if (shapeFlag & 2 /* STATEFUL_COMPONENT */) {
                processComponent(vnode, container, parentComponent);
            }
            break;
    }
};
function processFragment(vnode, container, parentComponent) {
    mountChildren(vnode, container, parentComponent);
}
function processText(vnode, container) {
    const { children } = vnode;
    const textNode = vnode.el = document.createTextNode(children);
    container.append(textNode);
}
function processElement(vnode, container, parentComponent) {
    mountElement(vnode, container, parentComponent);
}
function processComponent(vnode, container, parentComponent) {
    mountComponent(vnode, container, parentComponent);
}
function mountElement(vnode, container, parentComponent) {
    // string array
    const { props, children, shapeFlag } = vnode;
    const el = vnode.el = document.createElement(vnode.type);
    if (shapeFlag & 4 /* TEXT_CHILDREN */) {
        // text_children
        el.textContent = children;
    }
    else if (shapeFlag & 8 /* ARRAY_CHILDREN */) {
        // array_children
        mountChildren(vnode, el, parentComponent);
    }
    for (const key in props) {
        const val = props[key];
        const isOn = (key) => /^on[A-Z]/.test(key);
        if (isOn(key)) {
            const event = key.slice(2).toLowerCase();
            el.addEventListener(event, val);
        }
        else {
            el.setAttribute(key, Array.isArray(val) ? val.join(' ') : val);
        }
    }
    container.append(el);
}
function mountComponent(initialVNode, container, parentComponent) {
    const instance = createComponentInstance(initialVNode, parentComponent);
    setupComponent(instance);
    setupRenderEffect(instance, initialVNode, container);
}
function setupRenderEffect(instance, initialVNode, container) {
    const { proxy } = instance;
    const subTree = instance.render.call(proxy);
    // vnode -> patch
    // vnode -> element -> mountElement
    patch(subTree, container, instance);
    // element -> mount
    initialVNode.el = subTree.el;
}
function mountChildren(vnode, container, parentComponent) {
    vnode.children.forEach(child => {
        patch(child, container, parentComponent);
    });
}

// 整体流程
// createApp -> app.mount() -> 
// render -> patch -> 判断vnode类型 ->
// 如果是component -> mountComponent -> setupComponent+setupRenderEffect
const createApp = (rootComponent, parentComponent) => {
    return {
        mount(rootContainer) {
            // 先转化成 vnode
            // 所有的逻辑操作都会基于 vnode
            const vnode = createVNode(rootComponent);
            render(vnode, rootContainer, parentComponent);
        }
    };
};

const h = (type, props, children) => {
    return createVNode(type, props, children);
};

const renderSlots = (slots, name, props) => {
    const slot = slots[name];
    if (slot) {
        // slot是个function
        if (typeof slot === 'function')
            return createVNode(Fragment, {}, slot(props));
    }
};

const provide = (key, value) => {
    // 存
    const currentInstance = getCurrentInstance();
    if (currentInstance) {
        let { provides } = currentInstance;
        const parentProvides = currentInstance.parent.provides;
        // init
        if (provides === parentProvides) {
            provides = currentInstance.provides = Object.create(parentProvides);
        }
        provides[key] = value;
    }
};
const inject = (key, defaultValue) => {
    // 取
    const currInstance = getCurrentInstance();
    if (currInstance) {
        const parentProvides = currInstance.parent.provides;
        if (key in parentProvides) {
            return parentProvides[key];
        }
        else if (defaultValue) {
            if (typeof defaultValue === 'function') {
                return defaultValue();
            }
            return defaultValue;
        }
    }
};

export { createApp, createTextVNode, getCurrentInstance, h, inject, provide, renderSlots };
