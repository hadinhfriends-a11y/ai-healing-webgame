# AI INNER LAB — Web game “AI có thể chữa lành bạn không?”

Bản này là **web game chạy thật**, đã gắn sẵn backend Google Apps Script với Google Sheet nhận kết quả.

## Google Sheet đã gắn sẵn

- Spreadsheet ID: `19UFOvKJJBzt73KKUXaO67WHukCNMPOU_V2dIJ7B18_M`
- Tab lưu dữ liệu: `Kết quả`
- Trường liên hệ: **Zalo / SĐT**

> Spreadsheet ID nằm ở `Code.gs`, không cần nhập lại trong giao diện.

## Luồng trải nghiệm

1. Landing page: “AI có thể chữa lành bạn không?”
2. Khảo sát chính 8 câu
3. Bản soi chiếu AI với 4 chỉ số
4. Người dùng chọn điều đang tò mò nhất
5. AI đề xuất 1 trong 5 mini test
6. Người dùng làm test và nhận kết quả cá nhân hóa
7. Nếu bấm **Lưu & xem kết quả**, dữ liệu tự động ghi vào Google Sheet
8. Hệ thống tạo `Submission ID` + link riêng dạng `...?result=...`
9. Link kết quả chỉ tải dữ liệu kết quả cần hiển thị; **không trả Zalo/SĐT ra trang kết quả**

## File

- `index.html` — giao diện và logic web game
- `Code.gs` — backend Google Apps Script, đã gắn đúng Google Sheet
- `preview.html` — bản xem thử độc lập, dùng localStorage và không ghi Google Sheet

## Deploy một lần trên Google Apps Script

1. Mở Google Sheet **AI có thể chữa lành bạn không? - Kết quả khảo sát**.
2. Chọn **Extensions → Apps Script**.
3. Dán `Code.gs` vào file `Code.gs`.
4. Tạo file HTML tên **Index** và dán nội dung `index.html`.
5. Có thể chạy `setupSheet()` một lần để kiểm tra header.
6. Chọn **Deploy → New deployment → Web app**.
7. Execute as: **Me**.
8. Chọn quyền truy cập phù hợp với chiến dịch và deploy.
9. Dùng URL `/exec` làm link web game chính thức.

## Khi có link khóa học thật

Trong `Code.gs`, đổi:

`COURSE_URL: 'https://example.com/khoa-hoc'`

thành landing page thật của khóa **Nâng Cấp Bản Thân Trong Thời Đại AI**.

## Lưu ý

- `preview.html` không thể ghi trực tiếp vào Google Sheet vì nó chạy ngoài Apps Script.
- Bản deploy `/exec` mới là bản ghi dữ liệu thật qua `google.script.run`.
- Trải nghiệm này là công cụ tự khám phá, không phải chẩn đoán hay điều trị tâm lý.
