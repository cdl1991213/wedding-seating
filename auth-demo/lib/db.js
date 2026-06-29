// 存储适配器
// 线上用 Supabase (PostgreSQL)，本地开发用 JSON 文件

import fs from 'fs'
import path from 'path'

let supabase = null

async function getClient() {
  if (supabase) return supabase
  if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
    const { createClient } = await import('@supabase/supabase-js')
    supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    )
  }
  return supabase
}

const DATA_FILE = path.join(process.cwd(), 'data', 'users.json')

export async function getUsers() {
  const client = await getClient()
  if (client) {
    const { data, error } = await client.from('users').select('*').order('created_at')
    if (error) throw error
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
  const client = await getClient()
  if (client) {
    const { error } = await client.from('users').upsert(users, {
      onConflict: 'id',
      ignoreDuplicates: false
    })
    if (error) throw error
    return
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2))
}

export function getLocalPath() {
  return DATA_FILE
}
