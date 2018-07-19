import FB from 'fb'
import Server from '@syncano/core'
import * as crypto from 'crypto'

export default ctx => {
  const {users, response, logger} = new Server(ctx)
  const {debug} = logger('user-auth/social-login')
  const {accessToken} = ctx.args

  FB.api('me', {fields: 'id,name', access_token: accessToken}, async res => {
    debug('fb response', res)

    try {
      debug('finding user')

      const user = await users
        .fields('id', 'user_key as token', 'fullName', 'groups', 'created_at as createdAt')
        .firstOrCreate({
          username: res.id
        }, {
          username: res.id,
          email: res.email,
          password: crypto.randomBytes(16).toString('hex'),
          fullName: res.name
        })

      debug('user', user)

      return response.json(user)
    } catch (err) {
      debug('user not found')

      return response.json({message: 'An error occured!'}, 400)
    }
  })
}
