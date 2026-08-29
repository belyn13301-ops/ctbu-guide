# 生成导航站链接二维码
import qrcode
from qrcode.constants import ERROR_CORRECT_M

LINK = "https://c0d1d27a8a4d46ee90b190ac11ea3fbf.bj5.agentos-app.net"
OUT = "C:/Users/20501/WorkBuddy/2026-07-31-14-36-45/site/assets/qr.png"

qr = qrcode.QRCode(
    version=None,
    error_correction=ERROR_CORRECT_M,
    box_size=10,
    border=2,
)
qr.add_data(LINK)
qr.make(fit=True)

img = qr.make_image(fill_color="#4a3f3a", back_color="#ffffff").convert("RGB")
img.save(OUT)
print("QR saved:", OUT)
