/* global describe it before after */
import {assert} from 'chai'
import {run} from '@syncano/test'
import {createInstance, deleteInstance, uniqueInstance} from '@syncano/test-tools'

describe('register', () => {
  const instanceName = uniqueInstance()

  before(async () => {
    await createInstance(instanceName)
    process.env.SYNCANO_INSTANCE_NAME = instanceName
  })
  after(() => deleteInstance(instanceName))

  it('can register user with valid email', async () => {
    const args = {
      username: 'email@email.com',
      password: 'somepassword'
    }

    const result = await run('register', { args })
    assert.propertyVal(result, 'code', 200)
  })

  it('can\'t register existing user', async () => {
    const args = {
      username: 'email@email.com',
      password: 'somepassword'
    }

    const result = await run('register', { args })
    assert.propertyVal(result, 'code', 400)
    assert.propertyVal(result.data, 'username', 'User already exists.')
  })

  it('can\'t register user with invalid email', async () => {
    const args = {
      username: 'mail.com',
      password: 'somepassword'
    }

    const result = await run('register', { args })
    assert.propertyVal(result, 'code', 400)
    assert.propertyVal(result.data, 'username', 'Given email is invalid.')
  })
})
