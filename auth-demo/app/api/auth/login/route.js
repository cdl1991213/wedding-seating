import { login } from '@/lib/auth'

export async function POST(request) {
  const { email, password } = await request.json()

  if (!email || !password) {
    return Response.json({ error: '邮箱和密码不能为空' }, { status: 400 })
  }

  const result = await login(email, password)
  if (!result.ok) {
    return Response.json({ error: result.error }, { status: 401 })
  }

  return Response.json({
    token: result.token,
    user: result.user
  })
}
