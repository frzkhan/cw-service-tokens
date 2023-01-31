const { redisJson, redis } = require('@cowellness/cw-micro-service')()
const { customAlphabet } = require('nanoid')

const constants = require('./token.constants')
/**
 * @class TokenController
 * @classdesc Controller Token
 */
class TokenController {
  /**
   * Fetch data from redis using token
   * @param {String} id token id
   * @returns data from redis if found
   */
  async findById (id) {
    const key = this.redisKey(id)
    const data = await redisJson.get(key)

    return data || null
  }

  /**
   * Create a token and save provided data in redis
   * @param {Object} data the data to store
   * @param {Number} expire expiry ttl
   * @returns generated token
   */
  async create (data, expire) {
    const ex = expire || constants.TOKEN_EXPIRY_DEFAULT
    const token = this.generateToken()
    const key = this.redisKey(token)
    const value = {
      data
    }

    await redisJson.set(key, value, { expire: ex })
    return token
  }

  /**
   * Delete a token from redis
   * @param {String} id token id
   * @returns true
   */
  async delete (id) {
    const key = this.redisKey(id)

    await redisJson.del(key)
    return true
  }

  /**
   * Creates a key for redis
   * @param {String} id token id
   * @returns created key
   */
  redisKey (id) {
    return `t:${id}`
  }

  /**
   * Generates token using nanoid
   */
  generateToken () {
    const nanoid = customAlphabet(constants.NANOID_ALPHABETS, constants.TOKEN_LENGTH)

    return nanoid()
  }

  /**
   * Get token TTL
   * @param {String} token the token key to get expiry for
   * @returns ttl of token
   */
  ttl (token) {
    const key = this.redisKey(token)

    return redis.ttl(`jc:${key}`)
  }
}

module.exports = TokenController
