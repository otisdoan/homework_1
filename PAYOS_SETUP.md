# PayOS Setup Guide

## Cấu hình PayOS để thanh toán

### 1. Tạo tài khoản PayOS

- Truy cập: https://payos.vn/
- Đăng ký tài khoản merchant
- Lấy thông tin API credentials

### 2. Cấu hình Environment Variables

Thêm các biến môi trường sau vào file `.env.local`:

```env
# PayOS Configuration
PAYOS_CLIENT_ID="your-payos-client-id"
PAYOS_API_KEY="your-payos-api-key"
PAYOS_CHECKSUM_KEY="your-payos-checksum-key"

# App URL (cập nhật port nếu cần)
NEXT_PUBLIC_BASE_URL="http://localhost:3002"
```

### 3. Cài đặt PayOS SDK

```bash
npm install @payos/node
```

### 4. Demo Mode

Nếu chưa cấu hình PayOS, ứng dụng sẽ tự động chuyển sang chế độ demo:

- Thanh toán sẽ được mô phỏng
- Không cần thẻ thật
- Tự động chuyển đến trang thành công sau 3 giây

### 5. Test Thanh Toán

1. Thêm sản phẩm vào giỏ hàng
2. Vào trang giỏ hàng
3. Bấm "Proceed to Payment"
4. Nếu có lỗi PayOS, sẽ tự động chuyển sang demo mode

### 6. Webhook Configuration

- PayOS sẽ gửi webhook đến: `https://yourdomain.com/api/payment/webhook`
- Webhook xử lý callback khi thanh toán thành công/thất bại
- Tự động verify webhook data để đảm bảo an toàn

### 7. Troubleshooting

- **Lỗi "Payment system not configured"**: Chưa cấu hình PayOS credentials
- **Lỗi "PayOS service unavailable"**: API PayOS không hoạt động, chuyển sang demo
- **Lỗi 401 Unauthorized**: Chưa đăng nhập
- **Lỗi 400 Bad Request**: Giỏ hàng trống

### 8. Production Setup

Để sử dụng thật:

1. Cấu hình đầy đủ PayOS credentials
2. Đặt `NEXT_PUBLIC_BASE_URL` thành domain thật
3. Test với số tiền nhỏ trước
