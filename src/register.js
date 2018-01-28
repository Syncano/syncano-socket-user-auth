import Server from '@syncano/core'
import {isEmail} from './helpers'

export default async (ctx) => {
  const {users, response, logger} = new Server(ctx)
  const {username, password} = ctx.args

  const {debug} = logger('user:auth:register')

  if (isEmail(username)) {
    let user
    try {
      // Try to find user with this username
      user = await users.where('username', 'eq', username).first()
      if (user) {
        // If there is a user, we can't register him
        return response.json({username: 'User already exists.'}, 400)
      } else {
        // Let's try to create user account
        user = await users.create({username, password})
        return response.json({
          id: user.id,
          token: user.user_key,
          username: user.username
        })
      }
    } catch (err) {
      // When something went wrong
      debug(err)
      return response.json({message: err.message}, 400)
    }
  } else {
    return response.json({username: 'Given email is invalid.'}, 400)
  }
}
