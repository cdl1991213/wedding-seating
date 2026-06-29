'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.replace('/login')
      return
    }

    fetch('/api/auth/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('未登录')
        return res.json()
      })
      .then(data => setUser(data.user))
      .catch(() => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        router.replace('/login')
      })
      .finally(() => setLoading(false))
  }, [router])

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  if (loading) {
    return (
      <div style={{ color: '#666' }}>
        加载中…
      </div>
    )
  }

  const initial = user?.name?.charAt(0).toUpperCase() || '?'

  return (
    <div className="dashboard">
      <div className="avatar">{initial}</div>
      <h1>{user.name}</h1>
      <p className="email">{user.email}</p>

      <div className="info">
        <div>用户 ID：<span>{user.id}</span></div>
        <div>邮箱：<span>{user.email}</span></div>
        <div>昵称：<span>{user.name}</span></div>
      </div>

      <button className="logout" onClick={handleLogout}>
        退出登录
      </button>
    </div>
  )
}
