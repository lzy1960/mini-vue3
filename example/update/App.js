import { h, ref } from "../../lib/guide-mini-vue3.esm.js";

export const App = {
  name: 'App',
  setup () {
    const count = ref(0)
    const onClick = () => {
      count.value++
    }

    const props = ref({
      foo: 'foo',
      bar: 'bar'
    })

    const onChangePropsDemo1 = () => {
      props.value.foo = 'new-foo'
    }
    const onChangePropsDemo2 = () => {
      props.value.foo = undefined
    }
    const onChangePropsDemo3 = () => {
      props.value = {
        foo: 'foo'
      }
    }

    return {
      count,
      onClick,
      onChangePropsDemo1,
      onChangePropsDemo2,
      onChangePropsDemo3,
      props,
    }
  },
  render () {
    return h('div', {
      id: 'root',
      ...this.props
    }, [
      h('p', {}, 'count: ' + this.count),
      h('button', {
        onClick: this.onClick
      }, 'add'),
      h('button', {
        onClick: this.onChangePropsDemo1
      }, '修改props里的值'),
      h('button', {
        onClick: this.onChangePropsDemo2
      }, 'props里的值改为undefined'),
      h('button', {
        onClick: this.onChangePropsDemo3
      }, 'props重新赋值，有的属性没有了')
    ])
  }
};
