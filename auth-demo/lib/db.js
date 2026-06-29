// 存储适配器
// 线上（Vercel）用 KV (Redis)，本地开发用 JSON 文件

let kv = null

async function getKv() {
  if (kv) return kv
  if (process.env.KV_URL) {
    const { createClient } = await import('@vercel/kv')
    kv = createClient({
      url: process.env.KV_URL,
      token: process.env.KV_REST_API_TOKEN
    })
  }
  return kv
}

import fs from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data', 'users.json')

export async function getUsers() {
  const client = await getKv()
  if (client) {
    const data = await client.get('users')
    return data || []
  }
  // 本地 fallback
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'))
  } catch {
    return []
  }
}

export async function saveUsers(users) {
  const client = await getKv()
  if (client) {
    await client.set('users', users)
    return
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2))
}

export function getLocalPath() {
  return DATA_FILE
}
