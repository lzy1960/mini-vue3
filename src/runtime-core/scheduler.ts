const queue: any[] = []
let isFlushPending = false
const p = Promise.resolve()

export const queueJobs = (job) => {

  if (!queue.includes(job)) {
    queue.push(job)
  }

  queueFlash()
}

function queueFlash () {
  if (isFlushPending) return
  isFlushPending = true

  nextTick(flushJobs)
}

const flushJobs = () => {
  isFlushPending = false
  let job
  while (job = queue.shift()) {
    job && job()
  }
}

export const nextTick = (fn) => {
  return fn ? p.then(fn) : p
}
