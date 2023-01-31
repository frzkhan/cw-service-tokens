const config = require('config')
const cw = require('@cowellness/cw-micro-service')(config)
const faker = require('faker')
const constants = require('./token.constants')

beforeAll(async () => {
  await cw.autoStart()
  await cw.redis.flushdb()
})

afterAll(async () => {
  return cw.stopAll()
})

describe('Test Token', () => {
  it('should create token', async () => {
    const data = {
      user: faker.random.word()
    }
    const token = await cw.ctr.token.create(data)

    expect(token.length).toBe(constants.TOKEN_LENGTH)
  })
  it('should get data by token', async () => {
    const data = {
      user: faker.random.word()
    }
    const token = await cw.ctr.token.create(data)
    const redisData = await cw.ctr.token.findById(token)

    expect(data).toStrictEqual(redisData.data)
  })
  it('should delete data by token', async () => {
    const data = {
      user: faker.random.word()
    }
    const token = await cw.ctr.token.create(data)
    const beforeDelete = await cw.ctr.token.findById(token)
    const deleted = await cw.ctr.token.delete(token)
    const afterDelete = await cw.ctr.token.findById(token)

    expect(deleted).toBe(true)
    expect(data).toStrictEqual(beforeDelete.data)
    expect(afterDelete).toBe(null)
  })
  it('should get token expiry', async () => {
    const data = {
      user: faker.random.word()
    }
    const token = await cw.ctr.token.create(data)
    const res = await cw.fastify.inject({
      method: 'GET',
      url: `/api/tokens/token/${token}`
    })
    const responseData = res.json()
    expect(responseData.success).toBe(true)
    expect(responseData.data.expiry).toBeGreaterThan(0)
  })
  it('should fail to get invalid/expired token', async () => {
    const res = await cw.fastify.inject({
      method: 'GET',
      url: `/api/tokens/token/${faker.random.word()}`
    })
    const responseData = res.json()
    expect(responseData.success).toBe(false)
  })
})
