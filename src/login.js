/* global META, ARGS */
import fetch from 'axios'
import {users, response} from 'syncano-server'

const {username, password} = ARGS
const AUTH_URL = `https://api.syncano.io/v2/instances/${
  META.instance
}/users/auth/`

users
  .where('username', 'eq', username)
  .firstOrFail()
  .then(authorizeUser)
  .catch(respondWithInvalidCredentials)

function authorizeUser() {
  fetch({
    url: AUTH_URL,
    method: 'POST',
    data: JSON.stringify({username, password}),
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': META.token
    }
  })
    .then(respondWithValidCredentials)
    .catch(respondWithInvalidCredentials)
}

function respondWithValidCredentials({data}) {
  response.json({token: data.user_key, username: data.username})
}

function respondWithInvalidCredentials() {
  response.json({message: 'Given credentials are invalid.'}, 400)
}
