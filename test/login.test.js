/* global describe it before after */
import {assert} from 'chai'
import {run} from '@syncano/test'
import Server from '@syncano/core'
import {createInstance, deleteInstance, uniqueInstance} from '@syncano/test-tools'

describe('login', () => {
  let users
  const meta = {
    token: process.env.E2E_CLI_ACCOUNT_KEY
  }
  const instanceName = uniqueInstance()
  before(async () => {
    await createInstance(instanceName)
    process.env.SYNCANO_INSTANCE_NAME = instanceName

    const server = new Server({
      instanceName,
      meta: {
        api_host: process.env.SYNCANO_HOST,
        socket: 'test-socket',
        token: process.env.E2E_CLI_ACCOUNT_KEY
      }
    })

    users = server.users
  })
  after(() => deleteInstance(instanceName))

  it('can\'t login without credentials', async () => {
    const result = await run('login', {meta})
    assert.propertyVal(result, 'code', 400)
    assert.propertyVal(result.data, 'message', 'Given credentials are invalid.')
  })

  it('can login existing user', async () => {
    const credentials = {
      username: 'someusername',
      password: 'somepassword'
    }
    // Add test user
    await users.create(credentials)

    // Login using Socket `login` endpoint
    const result = await run('login', {
      args: {
        username: credentials.username,
        password: credentials.password
      },
      meta
    })

    assert.propertyVal(result, 'code', 200)
    assert.property(result.data, 'token')
    assert.property(result.data, 'username')
  })
})
