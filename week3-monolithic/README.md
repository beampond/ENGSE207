# Week 3 — TaskBoard: Monolithic Architecture

> ENGSE207 Software Architecture · มหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา  
> งานเดี่ยว (Individual Assignment)

---

## 👤 ข้อมูลผู้ทำ

| ชื่อ | อีเมล | บทบาท |
|------|-------|-------|
| ณัฏฐพงษ์ เรือนเทศ | nattapong.ru66@live.rmutl.ac.th | นักศึกษา |

---

## 🎯 วัตถุประสงค์

ฝึกสร้างแอปพลิเคชันแบบ **Monolithic Architecture** โดยให้ทุกอย่างรวมอยู่ในไฟล์และ process เดียวกัน ได้แก่ HTTP Server, Business Logic, Validation และ Database Access

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│         Monolithic Application          │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │  Presentation (HTML / CSS / JS)   │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │  Business Logic + Validation      │  │
│  │  (Routes ใน server.js)            │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │  Data Access (better-sqlite3)     │  │
│  └───────────────────────────────────┘  │
└──────────────────┬──────────────────────┘
                   │
             ┌─────▼─────┐
             │  tasks.db │
             └───────────┘
```

**ลักษณะสำคัญ:** ทุกอย่างรวมอยู่ใน `server.js` เดียว — นี่คือ Monolithic Architecture

---

## 📁 โครงสร้างโปรเจกต์

```
week3-monolithic/
├── server.js           ← จุดเดียวที่รันทุกอย่าง (Routes + Logic + DB)
├── package.json
├── database/
│   └── schema.sql      ← สร้าง table + seed data
├── public/
│   ├── index.html      ← Kanban Board UI
│   ├── style.css
│   └── app.js          ← Frontend fetch API
├── .gitignore
└── README.md
```

---

## 🚀 วิธีรัน

```bash
# 1. ติดตั้ง dependencies
npm install

# 2. รันเซิร์ฟเวอร์ (database จะถูกสร้างอัตโนมัติครั้งแรก)
npm run dev

# 3. เปิดเบราว์เซอร์
open http://localhost:3000
```

---

## 🔌 API Endpoints

| Method | Path | คำอธิบาย |
|--------|------|---------|
| GET | `/api/tasks` | ดึง tasks ทั้งหมด |
| GET | `/api/tasks?status=todo` | กรองตาม status |
| GET | `/api/tasks/:id` | ดึง task เดียว |
| POST | `/api/tasks` | สร้าง task ใหม่ |
| PUT | `/api/tasks/:id` | แก้ไข task |
| DELETE | `/api/tasks/:id` | ลบ task |
| GET | `/api/stats` | ดูสถิติภาพรวม |

**ตัวอย่าง Request Body (POST/PUT):**
```json
{
  "title": "ชื่อ Task",
  "description": "รายละเอียด",
  "status": "todo"
}
```

---

## ✅ Features

- Kanban Board แสดง 3 คอลัมน์ (Todo / In Progress / Done)
- เพิ่ม / แก้ไข / ลบ Task
- กรอง Task ตาม status ได้
- แสดงสถิติภาพรวมใน header

---

## 📦 Dependencies

| Package | Version | ใช้ทำอะไร |
|---------|---------|-----------|
| express | ^4.18.2 | HTTP Server |
| better-sqlite3 | ^9.4.3 | SQLite Database |
| nodemon | ^3.0.1 | Auto-restart (dev) |

---

## 💡 สิ่งที่เรียนรู้

**ข้อดีของ Monolithic ที่เห็นในงานนี้:**
- Setup ง่าย รันไฟล์เดียวจบ
- Debug ง่าย ทุกอย่างอยู่ที่เดียว
- ไม่มี network overhead ระหว่าง components

**ข้อจำกัดที่พบ:**
- `server.js` ยาวขึ้นเรื่อยๆ เมื่อเพิ่ม feature
- แก้ส่วนหนึ่ง อาจกระทบทุกอย่าง
- Scale ได้แค่ทั้งระบบ ไม่สามารถ scale แค่ส่วน DB หรือ Logic ได้

---

## 🔗 เปรียบเทียบกับ Week ถัดไป

Week 4 จะ refactor โค้ดชุดเดิมนี้ออกเป็น **Layered Architecture** แยก routes / services / repositories

---

*ENGSE207 Software Architecture — Week 3 · อ.ธนิต เกตุแก้ว*
