import { reactive, isReactive, isProxy, toRaw, shallowReadonly, readonly, shallowReactive } from '../reactive';

describe('reactive', () => {
  it('happy path', () => {
    const original = { foo: 1 }
    const observed = reactive(original)
    expect(observed).not.toBe(original)

    expect(observed.foo).toBe(1)

    expect(isReactive(observed)).toBe(true)
    expect(isReactive(original)).toBe(false)
    expect(isProxy(observed)).toBe(true)
  })

  test('nested reactive', () => {
    const original = {
      nested: {
        foo: 1
      },
      array: [{ bar: 2 }]
    }
    const observed = reactive(original)
    expect(observed.nested.foo).toBe(1)

    expect(isReactive(observed)).toBe(true)
    expect(isReactive(original)).toBe(false)
    expect(isReactive(observed.nested)).toBe(true)
    expect(isReactive(observed.array[0])).toBe(true)
  });
  it('happy path', () => {
    const original = { foo: { bar: 1 } }
    const observed = shallowReactive(original)
    expect(isReactive(observed)).toBe(true)
    expect(isReactive(observed.foo)).toBe(false)
  })
  it('happy path', () => {
    // toRaw 可以 return 通过 `reactive` 、 `readonly` 、`shallowReactive` 、`shallowReadonly` 包装的 origin 值
    const reactiveOrigin = { key: 'reactive' }
    expect(toRaw(reactive(reactiveOrigin))).toEqual(reactiveOrigin)
    const readonlyOrigin = { key: 'readonly' }
    expect(toRaw(readonly(readonlyOrigin))).toEqual(readonlyOrigin)
    const shallowReadonlyOrigin = { key: 'shallowReadonly' }
    expect(toRaw(shallowReadonly(shallowReadonlyOrigin))).toEqual(
      shallowReadonlyOrigin
    )
    const shallowReactiveOrigin = { key: 'shallowReactive' }
    expect(toRaw(shallowReactive(shallowReactiveOrigin))).toEqual(
      shallowReactiveOrigin
    )

    const nestedWrapped = {
      foo: { bar: { baz: 1 }, foo2: { bar: { baz: 2 } } },
    }
    expect(toRaw(reactive(nestedWrapped))).toEqual(nestedWrapped)
  })
});
