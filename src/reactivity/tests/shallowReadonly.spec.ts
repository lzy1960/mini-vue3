import { isReadonly, shallowReadonly } from '../reactive';

describe('shallowReadonly', () => {
  test('should not make non-reactive properties reactive', () => {
    const observed = shallowReadonly({ foo: { bar: 1 } })

    expect(isReadonly(observed)).toBe(true)
    expect(isReadonly(observed.foo)).toBe(false)
  });
});
