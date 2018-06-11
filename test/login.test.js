/* global describe it beforeAll afterAll */
import path from 'path'
import proxyquire from 'proxyquire'
import sinon from 'sinon'
import {assert} from 'chai'
import {run} from '@syncano/test'
import {createInstance, deleteInstance, uniqueInstance} from '@syncano/test-tools'

describe('login', () => {
  it('can\'t login without credentials', async () => {
    require('@syncano/core').__setMocks({
      users: {
        login: sinon.stub().onFirstCall().rejects()
      }
    })

    const result = await run('login')
    assert.propertyVal(result, 'code', 400)
    assert.propertyVal(result.data, 'message', 'Given credentials are invalid.')
  })

  it('can login existing user', async () => {
    const credentials = {
      username: 'someusername',
      password: 'somepassword'
    }

    require('@syncano/core').__setMocks({
      users: {
        login: sinon
                .stub()
                .onFirstCall()
                .resolves({user_key: 'somekey', username: 'someusername'})
      }
    })

    const result = await run('login', {
      args: {
        username: credentials.username,
        password: credentials.password
      }
    })

    assert.propertyVal(result, 'code', 200)
    assert.property(result.data, 'token')
    assert.property(result.data, 'username')
  })
})
