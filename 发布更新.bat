@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo 🚀 正在发布更新到 GitHub Pages...
echo.
git add -A
git commit -m "更新婚礼排座配置 - %DATE% %TIME%"
git push origin main
echo.
if %errorlevel% equ 0 (
    echo ✅ 发布成功！
    echo 🌐 https://cdl1991213.github.io/wedding-seating
    echo 请等待 1-2 分钟后访问
) else (
    echo ❌ 发布失败，请检查错误信息
)
echo.
pause
