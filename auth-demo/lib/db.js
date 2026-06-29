// 存储适配器
// 线上用 Supabase (PostgreSQL)，本地开发用 JSON 文件

import fs from 'fs'
import path from 'path'

let supabase = null
let supabaseReachable = null  // null=未检测  true=可用  false=不可用

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY

async function getClient() {
  if (supabase) return supabase
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null
  if (supabaseReachable === false) return null  // 之前检测过不可达，直接跳过

  const { createClient } = await import('@supabase/supabase-js')
  const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false },
    global: {
      fetch: (url, options) =>
        fetch(url, { ...options, signal: AbortSignal.timeout(5000) })
    }
  })

  // 检测连通性：尝试查询一条记录
  try {
    const { error } = await client.from('users').select('id').limit(1).maybeSingle()
    if (error && error.code === '42P01') {
      // 表不存在，但连接是通的
      console.warn('[db] Supabase connected but "users" table not found')
    }
    supabaseReachable = true
    supabase = client
  } catch (e) {
    supabaseReachable = false
    console.warn('[db] Supabase unreachable, will use local JSON:', e.message)
    return null
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
