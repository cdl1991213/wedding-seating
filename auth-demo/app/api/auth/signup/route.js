import { signup } from '@/lib/auth'

export async function POST(request) {
  const { email, password } = await request.json()

  if (!email || !password) {
    return Response.json({ error: '邮箱和密码不能为空' }, { status: 400 })
  }
  if (password.length < 6) {
    return Response.json({ error: '密码至少 6 位' }, { status: 400 })
  }

  const result = await signup(email, password)
  if (!result.ok) {
    return Response.json({ error: result.error }, { status: 400 })
  }

  return Response.json({
    token: result.token,
    user: result.user
  })
}
