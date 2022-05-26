import { ref } from '../ref';
import { effect } from '../effect';

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
});