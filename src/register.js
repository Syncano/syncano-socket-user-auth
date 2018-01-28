/* global ARGS */
import {users, response} from 'syncano-server'
import {isEmail} from './helpers'

const {username, password} = ARGS

if (isEmail(username)) {
  users
    .where('username', 'eq', username)
    .firstOrFail()
    .then(respondWithUserAlreadyExists)
    .catch(createUser)
} else {
  respondWithInvalidEmail()
}

function createUser() {
  const user = {
    username,
    password,
    national_id: ARGS.national_id
  }

  users
    .create(user)
    .then(respondWithUser)
    .catch(respondWithError)
}

function respondWithUser(res) {
  response.json({
    id: res.id,
    token: res.user_key,
    email: res.email
  })
}

function respondWithError({response: err}) {
  err.json().then(data => response.json(data, 400))
}

function respondWithUserAlreadyExists() {
  response.json({username: 'User already exists.'}, 400)
}

function respondWithInvalidEmail() {
  response.json({username: 'Given email is invalid.'}, 400)
}
