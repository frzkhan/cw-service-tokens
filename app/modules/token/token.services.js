const { ctr, rabbitmq } = require('@cowellness/cw-micro-service')()

rabbitmq.consume('/tokens/get', (msg) => {
  const id = msg.data.id

  return ctr.token.findById(id)
})

rabbitmq.consume('/tokens/post', (msg) => {
  const data = msg.data

  return ctr.token.create(data.data, data.expire)
})

rabbitmq.consume('/tokens/delete', (msg) => {
  const id = msg.data.id

  return ctr.token.delete(id)
})
