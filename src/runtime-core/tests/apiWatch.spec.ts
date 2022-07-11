import { ref } from '../../reactivity';
import { reactive } from '../../reactivity/reactive';
import { watch, watchEffect } from '../apiWatch';
import { nextTick } from '../scheduler';

describe('api: watch', () => {
  it('effect', async () => {

    const state = reactive({ count: 0 })
    let dummy
    watchEffect(() => {
      dummy = state.count
    })
    expect(dummy).toBe(0)
    state.count++
    await nextTick()
    expect(dummy).toBe(1)
  });
  it('watching single source: getter', async () => {
    const state = reactive({ count: 0 })
    let dummy
    watch(
      () => state.count,
      (count, prevCount) => {
        dummy = [count, prevCount]
        // assert types
        count + 1
        if (prevCount) {
          prevCount + 1
        }
      }
    )
    state.count++
    await nextTick()
    expect(dummy).toMatchObject([1, 0])
  })
  it('watching single source: ref', async () => {
    const count = ref(0)
    let dummy
    watch(count, (count, prevCount) => {
      dummy = [count, prevCount]
      // assert types
      count + 1
      if (prevCount) {
        prevCount + 1
      }
    })
    count.value++
    await nextTick()
    expect(dummy).toMatchObject([1, 0])
  })
  it('should not fire if watched getter result did not change', async () => {
    const spy = jest.fn()
    const n = ref(0)
    watch(() => n.value % 2, spy)

    n.value++
    await nextTick()
    expect(spy).toBeCalledTimes(1)

    n.value += 2
    await nextTick()
    // should not be called again because getter result did not change
    expect(spy).toBeCalledTimes(1)
  })
});
