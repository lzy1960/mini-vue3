import { ref, isRef, unRef, proxyRefs } from '../ref';
import { effect } from '../effect';
import { reactive } from '../reactive';

describe('ref', () => {
  it('happy path', () => {
    const a = ref(1)
    expect(a.value).toBe(1)
  });

  it('should be reactive', () => {
    const a = ref(1)
    let calls = 0
    let dummy
    effect(() => {
      calls++
      dummy = a.value
    })

    expect(dummy).toBe(1)
    expect(calls).toBe(1)

    a.value = 2
    expect(dummy).toBe(2)
    expect(calls).toBe(2)

    a.value = 2
    expect(dummy).toBe(2)
    expect(calls).toBe(2)
  });

  it('nested should be reactive', () => {
    const a = ref({
      foo: 1
    })
    let dummy
    effect(() => {
      dummy = a.value.foo
    })

    expect(dummy).toBe(1)
    a.value.foo = 2
    expect(dummy).toBe(2)
  });

  it('isRef', () => {
    const a = ref(1)
    const user = reactive({
      age: 18
    })
    expect(isRef(a)).toBe(true)
    expect(isRef(1)).toBe(false)
    expect(isRef(user)).toBe(false)
  })

  it('unRef', () => {
    const a = ref(1)
    expect(unRef(a)).toBe(1)
    expect(unRef(1)).toBe(1)
  })

  it('proxyRefs', () => {
    const user = {
      age: ref(18),
      name: 'zs'
    }
    const proxyUser = proxyRefs(user)

    expect(user.age.value).toBe(18)
    expect(proxyUser.age).toBe(18)
    expect(proxyUser.name).toBe('zs')

    proxyUser.age = 19
    expect(proxyUser.age).toBe(19)
    expect(user.age.value).toBe(19)

    // proxyUser.age = ref(20)
    // expect(proxyUser.age).toBe(20)
    // expect(user.age.value).toBe(19)


  });
});
