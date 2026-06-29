'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    const data = await res.json()

    if (!res.ok) {
      setError(data.error)
      setLoading(false)
      return
    }

    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    router.push('/dashboard')
  }

  return (
    <div className="card">
      <h1>登录</h1>
      <p className="sub">欢迎回来</p>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <label htmlFor="email">邮箱</label>
        <input
          id="email"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">密码</label>
        <input
          id="password"
          type="password"
          placeholder="至少 6 位"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? '登录中…' : '登录'}
        </button>
      </form>

      <p className="link">
        没有账号？<Link href="/signup">注册</Link>
      </p>
    </div>
  )
}
