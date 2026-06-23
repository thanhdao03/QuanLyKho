# Hệ thống quản lý kho hàng (Warehouse Management Demo)

Demo giao diện quản lý kho hàng nội bộ, xây dựng bằng React. Dự án tập trung thể hiện **tư duy phân tích nghiệp vụ (business analysis)** đứng sau một hệ thống vận hành kho, không chỉ là giao diện đẹp.

> Dữ liệu trong dự án là **mock data** (dữ liệu giả lập), không kết nối backend hay cơ sở dữ liệu thật. Mọi thay đổi chỉ tồn tại trong phiên làm việc hiện tại.

---

## 1. Bài toán nghiệp vụ

Một kho hàng cần trả lời chính xác một câu hỏi tại mọi thời điểm: **"Hiện đang còn bao nhiêu hàng?"** Mọi tính năng trong hệ thống đều phục vụ việc giữ cho câu trả lời đó luôn đúng và có thể giải trình được khi cần.

Nghiệp vụ kho vận hành theo một vòng lặp 3 bước:

1. **Nhập kho** — hàng về từ nhà cung cấp, số lượng tồn tăng lên.
2. **Xuất kho** — hàng ra khỏi kho (bán, dùng nội bộ, chuyển kho...), số lượng tồn giảm xuống.
3. **Đối soát** — tồn kho trên hệ thống phải khớp với tồn kho thực tế; nếu có biến động, phải có hồ sơ (phiếu nhập/xuất) để giải trình.

### Phạm vi đã triển khai trong demo

Vì đây là bản demo có giới hạn thời gian, phạm vi được thu hẹp có chủ đích vào nghiệp vụ kho vật tư/hàng hóa nội bộ (không bao gồm: quản lý nhà cung cấp đầy đủ, giá vốn FIFO/LIFO, quản lý vị trí kệ/kho nhiều chi nhánh). Đây là các hướng mở rộng hợp lý nếu phát triển tiếp.

---

## 2. Đối tượng dữ liệu (Entities)

| Đối tượng | Mô tả | Thuộc tính chính |
|---|---|---|
| **Sản phẩm** | Một mã hàng (SKU) đang được quản lý trong kho | Mã SKU, tên, danh mục, đơn vị tính, số lượng tồn hiện tại, mức tồn tối thiểu |
| **Phiếu nhập kho** | Một lượt hàng nhập về | Sản phẩm, số lượng, ngày, nhà cung cấp/lý do nhập |
| **Phiếu xuất kho** | Một lượt hàng xuất ra | Sản phẩm, số lượng, ngày, lý do xuất |
| **Lịch sử biến động** | Nhật ký toàn bộ các lượt nhập/xuất | Loại (nhập/xuất), sản phẩm, số lượng, ngày, lý do |

`Mức tồn tối thiểu` (minStock) là ngưỡng để hệ thống tự cảnh báo khi sản phẩm cần được nhập thêm — đây là một quy tắc nghiệp vụ, không phải số liệu hiển thị đơn thuần.

---

## 3. Quy tắc nghiệp vụ (Business Rules)

Đây là phần quan trọng nhất để thể hiện tư duy BA — các ràng buộc này mô phỏng cách một kho hàng thật vận hành để tránh sai sót và đảm bảo có thể kiểm soát được:

1. **Không xuất kho vượt quá tồn hiện có.**
   Hệ thống kiểm tra số lượng tồn trước khi xác nhận phiếu xuất. Nếu số lượng yêu cầu lớn hơn tồn kho, phiếu bị từ chối kèm thông báo rõ "đang còn bao nhiêu".
   *Lý do nghiệp vụ:* tránh tình trạng tồn kho âm — một lỗi nghiêm trọng trong vận hành kho thực tế, vì không thể xuất ra thứ không tồn tại.

2. **Số lượng tồn chỉ thay đổi thông qua phiếu nhập/xuất, không sửa tay trực tiếp.**
   Người dùng không có cách nào chỉnh số tồn của một sản phẩm ngoài việc tạo phiếu nhập hoặc xuất.
   *Lý do nghiệp vụ:* đảm bảo mọi thay đổi tồn kho đều có hồ sơ (audit trail) để giải trình khi đối soát, tránh chênh lệch không lý do.

3. **Mỗi phiếu nhập/xuất phải có lý do/nguồn gốc rõ ràng.**
   Không cho phép tạo phiếu mà bỏ trống nhà cung cấp (nhập) hoặc lý do xuất.
   *Lý do nghiệp vụ:* phục vụ tra soát sau này — khi có sai lệch, cần biết hàng đi đâu, về từ ai.

4. **Cảnh báo tồn kho thấp dựa trên mức tối thiểu của từng sản phẩm.**
   Mỗi sản phẩm có một `mức tồn tối thiểu` riêng (không dùng một ngưỡng chung cho tất cả). Khi tồn kho xuống dưới mức này, hệ thống đánh dấu "Dưới mức tối thiểu" trên Dashboard và trang Sản phẩm.
   *Lý do nghiệp vụ:* các mặt hàng có tốc độ tiêu thụ khác nhau, nên ngưỡng cảnh báo cần riêng theo từng mã hàng, không thể dùng một con số cứng cho toàn kho.

5. **Mọi giao dịch đều được ghi vào Lịch sử biến động.**
   Không có lượt nhập/xuất nào "ẩn" — tất cả đều xuất hiện trong nhật ký, có thể lọc theo loại (nhập/xuất).
   *Lý do nghiệp vụ:* đây là yêu cầu cơ bản của kiểm soát nội bộ (internal control) cho bất kỳ hệ thống quản lý tài sản nào.

---

## 4. Luồng màn hình

| Màn hình | Vai trò |
|---|---|
| **Tổng quan (Dashboard)** | Thống kê tổng SKU, tổng số lượng tồn, số mã hàng cần nhập thêm, biểu đồ nhập/xuất theo ngày |
| **Sản phẩm** | Danh sách toàn bộ sản phẩm, tìm kiếm theo tên/mã SKU, lọc theo danh mục, hiển thị trạng thái tồn kho |
| **Nhập kho** | Form tạo phiếu nhập — chọn sản phẩm, số lượng, ngày, nguồn nhập |
| **Xuất kho** | Form tạo phiếu xuất — có kiểm tra tồn kho trước khi xác nhận |
| **Lịch sử** | Nhật ký toàn bộ biến động, lọc theo loại nhập/xuất |

---

## 5. Hướng phát triển tiếp (nếu có thêm thời gian)

Những mục này **không** nằm trong phạm vi demo hiện tại, nhưng là bước hợp lý tiếp theo nếu phát triển thành sản phẩm thật:

- Phân quyền theo vai trò (thủ kho / quản lý kho / admin) — hiện tại demo coi mọi người dùng có cùng một quyền
- Quản lý giá vốn theo lô nhập (FIFO/LIFO) khi một sản phẩm có nhiều lần nhập với giá khác nhau
- Quản lý kho theo nhiều vị trí/chi nhánh, hỗ trợ chuyển kho nội bộ
- Xuất báo cáo (Excel/PDF) theo kỳ
- Kết nối backend thật và cơ sở dữ liệu để lưu trữ lâu dài

---

## 6. Công nghệ sử dụng

- **React** (function components, hooks: `useState`, `useMemo`)
- **Recharts** — biểu đồ nhập/xuất theo ngày
- **Lucide React** — icon hệ thống
- Toàn bộ dữ liệu là **mock data** được khai báo sẵn trong code, không có backend/API thật

---

## 7. Giả định đã đặt ra

Vì đề bài chỉ yêu cầu chung là "làm web quản lý kho", các giả định sau được đặt ra để thu hẹp phạm vi cho phù hợp với thời gian làm bài:

- Một loại hình kho duy nhất (không phân biệt nhiều chi nhánh/nhiều kho)
- Không có khái niệm "giá trị hàng hóa" (đơn giá, tổng giá trị tồn) — chỉ quản lý theo số lượng
- Không có bước duyệt cho phiếu nhập/xuất — người tạo phiếu có quyền xác nhận luôn (phù hợp với mô hình kho nhỏ, một thủ kho phụ trách)
