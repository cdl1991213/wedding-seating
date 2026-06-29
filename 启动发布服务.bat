@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo ════════════════════════════════════
echo     💒 婚礼排座系统 - 发布服务
echo ════════════════════════════════════
echo.
echo 启动后台发布服务 (按 Ctrl+C 停止)...
echo.
echo 请保持此窗口打开，在网页中点击"发布更新"即可
echo.

python -c "
import http.server
import json
import subprocess
import os
import sys
import urllib.parse

class PublishHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path == '/publish':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            try:
                result = subprocess.run(
                    ['git', 'add', '-A'],
                    capture_output=True, text=True, cwd=os.path.dirname(os.path.abspath(__file__))
                )
                result2 = subprocess.run(
                    ['git', 'commit', '--allow-empty', '-m', '更新婚礼排座'],
                    capture_output=True, text=True, cwd=os.path.dirname(os.path.abspath(__file__))
                )
                result3 = subprocess.run(
                    ['git', 'push', 'origin', 'main'],
                    capture_output=True, text=True, cwd=os.path.dirname(os.path.abspath(__file__))
                )
                resp = {
                    'success': result3.returncode == 0,
                    'commit': result2.stdout + result2.stderr,
                    'push': result3.stdout + result3.stderr
                }
                self.wfile.write(json.dumps(resp, ensure_ascii=False).encode('utf-8'))
                if result3.returncode == 0:
                    print('✅ 发布成功')
                else:
                    print('❌ 推送失败:', result3.stderr)
            except Exception as e:
                self.wfile.write(json.dumps({'success': False, 'error': str(e)}, ensure_ascii=False).encode('utf-8'))
                print('❌ 错误:', e)
        else:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b'Not found')
    
    def log_message(self, format, *args):
        pass  # 静默日志

port = 18923
server = http.server.HTTPServer(('127.0.0.1', port), PublishHandler)
print(f'🌐 本地服务已启动: http://127.0.0.1:{port}')
print(f'   在网页中点击"发布更新"按钮即可推送')
server.serve_forever()
"

pause
