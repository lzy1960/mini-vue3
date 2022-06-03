import { toHandlerKey, camelize } from '../shared/index';

export const emit = (instance, event, ...args) => {
  console.log('emit', event)

  // instance.props -> event
  const { props } = instance

  // TPP
  // 先写一个特定的行为 -> 重构为通用的行为
  const handlerName = toHandlerKey(camelize(event))
  const handler = props[handlerName]
  handler && handler(...args)
}
