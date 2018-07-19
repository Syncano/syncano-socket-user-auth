import FB from 'fb'
import Server from '@syncano/core'
import * as crypto from 'crypto'
export default ctx => {
  const {users, response, logger} = Server(ctx)
  const {debug} = logger('hello script')

  // const network = ctx.args.network
  const accessToken = ctx.args.access_token

  FB.api('me', {fields: 'id,name', access_token: accessToken}, async res => {
    debug('fb response', res)
    try {
      debug('finding user')
      const user = await users
        .fields('id', 'user_key', 'full_name', 'groups', 'created_at')
        .firstOrCreate({
          username: res.id
        }, {
          username: res.id,
          password: crypto.randomBytes(16).toString('hex'),
          full_name: res.name
        })
      debug('user', user)
      return response.json(user)
    } catch (err) {
      debug('user not found')
      return response.json({msg: 'Error!'}, 400)
    }
  })
}
