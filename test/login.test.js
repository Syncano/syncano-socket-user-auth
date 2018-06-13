/* global describe it expect */
import sinon from 'sinon'
import {run} from '@syncano/test'

describe('login', () => {
  it('can\'t login without credentials', async () => {
    require('@syncano/core').__setMocks({
      users: {
        login: sinon.stub().onFirstCall().rejects()
      }
    })

    const result = await run('login')
    expect(result).toHaveProperty('code', 400)
    expect(result.data).toHaveProperty('message', 'Given credentials are invalid.')
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

    expect(result).toHaveProperty('code', 200)
    expect(result.data).toHaveProperty('token')
    expect(result.data).toHaveProperty('username')
  })
})
