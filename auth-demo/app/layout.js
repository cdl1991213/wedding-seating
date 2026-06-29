import './globals.css'

export const metadata = {
  title: 'Auth Demo',
  description: '最简单的注册登录 Demo',
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh">
      <body>{children}</body>
    </html>
  )
}
