import { getUserByToken } from '@/lib/auth'

export async function GET(request) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
  const user = await getUserByToken(token)
  if (!user) {
    return Response.json({ error: '未登录' }, { status: 401 })
  }
  return Response.json({ user })
}
