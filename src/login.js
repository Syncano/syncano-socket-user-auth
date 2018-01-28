import Server from '@syncano/core'

export default async (ctx) => {
  const {users, response, logger} = new Server(ctx)
  const {username, password} = ctx.args

  const {debug} = logger('user:auth:login')

  try {
    const authorizedUser = await users.login({username, password})

    response.json({
      token: authorizedUser.user_key,
      username: authorizedUser.username
    })
  } catch (err) {
    debug(err)
    response.json({message: 'Given credentials are invalid.'}, 400)
  }
}
