const token = {
  schema: {
    tags: ['Token'],
    summary: 'Get a expiry of token',
    params: {
      type: 'object',
      properties: {
        token: {
          type: 'string',
          description: 'Token'
        }
      }
    }
  }
}
module.exports = {
  token
}
