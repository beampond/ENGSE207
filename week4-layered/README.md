# Week 4 — TaskBoard: Layered Architecture

> ENGSE207 Software Architecture · มหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา  
> งานกลุ่ม (Group Assignment)

---

## 👥 สมาชิกกลุ่ม

| ชื่อ | อีเมล | บทบาท |
|------|-------|-------|
| พิชณ์ สินธรสวัสดิ์ | pich.si67@live.rmutl.ac.th | Tester |
| ณัฏฐพงษ์ เรือนเทศ | nattapong.ru66@live.rmutl.ac.th | System Analyst (SA) |

---

## 🎯 วัตถุประสงค์

Refactor โค้ดจาก Week 3 (Monolithic) ออกเป็น **Layered Architecture** 3 ชั้น โดยแต่ละชั้นมีหน้าที่ชัดเจน ไม่ยุ่งเกี่ยวกัน (Separation of Concerns)

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────┐
│              Layered Architecture            │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │  Layer 1: Presentation                 │  │
│  │  src/routes/taskRoutes.js              │  │
│  │  รับ HTTP Request → ส่งให้ Service      │  │
│  └────────────────────┬───────────────────┘  │
│                       │ เรียกใช้              │
│  ┌────────────────────▼───────────────────┐  │
│  │  Layer 2: Business Logic               │  │
│  │  src/services/taskService.js           │  │
│  │  Validation + Business Rules           │  │
│  └────────────────────┬───────────────────┘  │
│                       │ เรียกใช้              │
│  ┌────────────────────▼───────────────────┐  │
│  │  Layer 3: Data Access                  │  │
│  │  src/repositories/taskRepository.js   │  │
│  │  ติดต่อ Database โดยตรง               │  │
│  └────────────────────┬───────────────────┘  │
└───────────────────────┼──────────────────────┘
                        │
                  ┌─────▼─────┐
                  │  tasks.db │
                  └───────────┘
```

**กฎสำคัญ:** Layer บนเรียก Layer ล่างได้เท่านั้น — Layer ล่างไม่รู้จัก Layer บน

---

## 📁 โครงสร้างโปรเจกต์

```
week4-layered/
├── server.js                          ← Bootstrap เท่านั้น
├── package.json
├── src/
│   ├── routes/
│   │   └── taskRoutes.js              ← Layer 1: รับ/ส่ง HTTP
│   ├── services/
│   │   └── taskService.js             ← Layer 2: Business Logic
│   └── repositories/
│       └── taskRepository.js          ← Layer 3: Database
├── database/
│   └── schema.sql
├── public/
│   ├── index.html
│   ├── style.css
│   └── app.js
├── .gitignore
└── README.md
```

---

## 🚀 วิธีรัน

```bash
# 1. ติดตั้ง dependencies
npm install

# 2. รันเซิร์ฟเวอร์
npm run dev

# 3. เปิดเบราว์เซอร์
open http://localhost:3000
```

---

## 🔌 API Endpoints

| Method | Path | Layer ที่รับผิดชอบ |
|--------|------|-------------------|
| GET | `/api/tasks` | Route → Service → Repository |
| GET | `/api/tasks/:id` | Route → Service → Repository |
| POST | `/api/tasks` | Route → Service (validate) → Repository |
| PUT | `/api/tasks/:id` | Route → Service (validate) → Repository |
| DELETE | `/api/tasks/:id` | Route → Service (check exist) → Repository |
| GET | `/api/tasks/stats` | Route → Service → Repository |

---

## 📌 หน้าที่แต่ละ Layer

### Layer 1 — Routes (`taskRoutes.js`)
- รับ HTTP Request จาก client
- เรียก Service และรับผลลัพธ์
- ส่ง HTTP Response กลับ
- **ไม่มี** business logic ใดๆ

### Layer 2 — Service (`taskService.js`)
- Validate ข้อมูล (title ต้องไม่ว่าง, status ต้องถูกต้อง)
- ใส่ business rules (ตรวจว่า task มีอยู่ก่อน update/delete)
- **ไม่รู้จัก** HTTP Request/Response
- **ไม่รู้จัก** Database โดยตรง

### Layer 3 — Repository (`taskRepository.js`)
- เขียน SQL query ทั้งหมด
- จัดการ Database connection
- **ไม่มี** business logic ใดๆ

---

## 💡 สิ่งที่เรียนรู้

**ความแตกต่างจาก Monolithic (Week 3):**

| ด้าน | Week 3 Monolithic | Week 4 Layered |
|------|-------------------|----------------|
| โค้ด | รวมใน server.js เดียว | แยก 3 ไฟล์ ตามหน้าที่ |
| แก้ไข | แก้ที่เดียวกระทบทั้งหมด | แก้ layer ที่ต้องการ |
| Test | ต้องรันทั้งระบบ | Test แต่ละ layer แยกได้ |
| อ่านโค้ด | ยากเมื่อระบบใหญ่ | เข้าใจง่าย รู้ว่าแต่ละส่วนทำอะไร |

**ข้อดีที่เห็นชัด:**
- เปลี่ยน database (เช่น SQLite → PostgreSQL) แก้แค่ `taskRepository.js`
- เพิ่ม business rule แก้แค่ `taskService.js`
- Developer ใหม่เข้ามาเข้าใจโครงสร้างได้เร็ว

---

## 🔗 วิวัฒนาการ Architecture

```
Week 3                   Week 4
─────────────────        ─────────────────────────────
server.js                server.js (bootstrap only)
  ├─ DB setup              src/routes/taskRoutes.js
  ├─ Routes                src/services/taskService.js
  ├─ Validation            src/repositories/taskRepository.js
  └─ SQL queries
```

---

*ENGSE207 Software Architecture — Week 4 · อ.ธนิต เกตุแก้ว*
