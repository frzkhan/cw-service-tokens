const { ctr } = require('@cowellness/cw-micro-service')()
const routeSchema = require('./token.schema')

module.exports = async function (fastify, opts, done) {
  fastify.get('/:token', routeSchema.token, async function (request, reply) {
    const token = request.params.token
    const ttl = await ctr.token.ttl(token)

    if (ttl < 0) {
      return reply.cwsendFail({
        message: 'Token not found',
        _message: '_errors.not_found'
      })
    }
    reply.cwsendSuccess({
      data: {
        expiry: ttl
      }
    })
  })
  done()
}
