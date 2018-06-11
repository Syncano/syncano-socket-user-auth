/* global describe it beforeAll afterAll */
import sinon from 'sinon'
import {assert} from 'chai'
import {run} from '@syncano/test'
import {createInstance, deleteInstance, uniqueInstance} from '@syncano/test-tools'

describe('register', () => {
  it('can register user with valid email', async () => {
    const args = {
      username: 'email@email.com',
      password: 'somepassword'
    }

    require('@syncano/core').__setMocks({
      users: {
        where: () => {
          return {
            first: sinon.stub().onFirstCall().resolves(null)
          }
        },
        create: sinon.stub().onFirstCall().resolves({
          id: 1,
          username: args.username,
          token: args.token
        })
      }
    })

    const result = await run('register', { args })
    expect(result).toHaveProperty('code', 200)
  })

  it('can\'t register existing user', async () => {
    const args = {
      username: 'email@email.com',
      password: 'somepassword'
    }

    require('@syncano/core').__setMocks({
      users: {
        where: () => {
          return {
            first: sinon.stub().onFirstCall().resolves({})
          }
        }
      }
    })

    const result = await run('register', { args })
    expect(result).toHaveProperty('code', 400)
    expect(result.data).toHaveProperty('username', 'User already exists.')
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
