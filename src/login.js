import Server from '@syncano/core'

export default async (ctx) => {
  const {users, response, logger} = new Server(ctx)
  const {username, password} = ctx.args
  const {debug} = logger('user-auth/login')

  try {
    const user = await users.login({username, password})

    response.json({
      id: user.id,
      token: user.user_key,
      username: user.username,
      fullName: user.fullName,
      groups: user.groups,
      createdAt: user.createdAt
    })
  } catch (err) {
    debug(err)

    response.json({message: 'Given credentials are invalid.'}, 400)
  }
}
