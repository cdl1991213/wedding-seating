import crypto from 'crypto'
import { getUsers, saveUsers } from './db'

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex')
}

function generateToken() {
  return crypto.randomBytes(32).toString('hex')
}

export async function signup(email, password) {
  const users = await getUsers()
  if (users.find(u => u.email === email)) {
    return { ok: false, error: '该邮箱已被注册' }
  }
  const user = {
    id: crypto.randomUUID(),
    email,
    name: email.split('@')[0],
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString()
  }
  users.push(user)
  const token = generateToken()
  user.token = token
  await saveUsers(users.map(u => u.id === user.id ? user : u))
  return { ok: true, token, user: { id: user.id, email: user.email, name: user.name } }
}

export async function login(email, password) {
  const users = await getUsers()
  const user = users.find(u => u.email === email)
  if (!user || user.passwordHash !== hashPassword(password)) {
    return { ok: false, error: '邮箱或密码错误' }
  }
  const token = generateToken()
  user.token = token
  await saveUsers(users.map(u => u.id === user.id ? user : u))
  return { ok: true, token, user: { id: user.id, email: user.email, name: user.name } }
}

export async function getUserByToken(token) {
  if (!token) return null
  const users = await getUsers()
  const user = users.find(u => u.token === token)
  if (!user) return null
  return { id: user.id, email: user.email, name: user.name }
}
