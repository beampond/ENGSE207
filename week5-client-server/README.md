# Week 5 — TaskBoard: Client-Server Architecture

> ENGSE207 Software Architecture · มหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา  
> งานเดี่ยว (Individual Assignment)

---

## 👤 ข้อมูลผู้ทำ

| ชื่อ | อีเมล | บทบาท |
|------|-------|-------|
| ณัฏฐพงษ์ เรือนเทศ | nattapong.ru66@live.rmutl.ac.th | นักศึกษา |

---

## 🎯 วัตถุประสงค์

แยก **Client** (Browser) กับ **Server** (API) ออกจากกันอย่างชัดเจน โดย Server ไม่ทำหน้าที่ serve static files อีกต่อไป Client ส่ง HTTP Request ข้ามมาหา Server ต่างกัน

---

## 🏗️ Architecture

```
┌──────────────────────┐          ┌──────────────────────────┐
│   CLIENT (Browser)   │          │   SERVER (port 3001)     │
│                      │          │                          │
│  public/index.html   │  HTTP /  │  server.js               │
│  public/app.js  ─────┼──REST ──►│  src/routes/             │
│  public/style.css    │  JSON    │  src/services/           │
│                      │◄─────────│  src/repositories/       │
│  เปิดด้วย Live Server│  Response│                          │
│  (port 5500)         │          │  ── API only ──           │
│                      │          │  ไม่ serve static files   │
└──────────────────────┘          └──────────────┬───────────┘
                                                  │
                                            ┌─────▼─────┐
                                            │  tasks.db │
                                            └───────────┘
```

**ความต่างจาก Week 4:** Server ไม่มี `express.static()` แล้ว — Client และ Server แยกกันสมบูรณ์

---

## 📁 โครงสร้างโปรเจกต์

```
week5-client-server/
├── server.js                 ← API Server (port 3001) เท่านั้น
├── package.json
├── src/
│   ├── routes/taskRoutes.js
│   ├── services/taskService.js
│   └── repositories/taskRepository.js
├── database/
│   └── schema.sql
├── public/                   ← Client (เปิดด้วย Live Server แยก)
│   ├── index.html
│   ├── style.css
│   └── app.js                ← fetch('http://localhost:3001/api/...')
├── .gitignore
└── README.md
```

---

## 🚀 วิธีรัน

ต้องรัน **2 อย่างพร้อมกัน**:

```bash
# Terminal 1 — รัน API Server
cd week5-client-server
npm install
npm run dev
# → API พร้อมที่ http://localhost:3001
```

```bash
# Terminal 2 — เปิด Client
# วิธีที่ 1: VS Code → คลิกขวาที่ public/index.html → "Open with Live Server"
# วิธีที่ 2: ใช้ browser เปิดไฟล์โดยตรง (อาจเจอ CORS บางเบราว์เซอร์)
```

> **หมายเหตุ:** `server.js` เปิด CORS ไว้แล้ว สามารถเรียกจาก origin ใดก็ได้ในการพัฒนา

---

## 🔌 API Endpoints

Server รับที่ `http://localhost:3001`

| Method | Path | คำอธิบาย |
|--------|------|---------|
| GET | `/api/tasks` | ดึง tasks ทั้งหมด |
| GET | `/api/tasks/:id` | ดึง task เดียว |
| POST | `/api/tasks` | สร้าง task ใหม่ |
| PUT | `/api/tasks/:id` | แก้ไข task |
| DELETE | `/api/tasks/:id` | ลบ task |
| GET | `/` | ข้อมูล API (welcome) |

---

## 💡 สิ่งที่เรียนรู้

**ความแตกต่างจาก Week 4:**

| ด้าน | Week 4 Layered | Week 5 Client-Server |
|------|----------------|----------------------|
| Static files | Server serve ให้ | Client แยกออกมา |
| Port | 3000 (ทุกอย่าง) | Server: 3001, Client: แยก |
| CORS | ไม่จำเป็น | จำเป็น (ต่าง origin) |
| Communication | In-process | HTTP Request/Response |

**ข้อดีที่เห็น:**
- Frontend team พัฒนาแยกกับ Backend team ได้สมบูรณ์
- เปลี่ยน Frontend framework (เช่น React/Vue) ได้โดยไม่กระทบ Server
- Server รองรับ Client หลายตัวได้ (Web, Mobile, Desktop)

**ข้อจำกัด:**
- ต้องจัดการ CORS
- ต้องรัน 2 process
- Network latency เพิ่มขึ้น

---

*ENGSE207 Software Architecture — Week 5 · อ.ธนิต เกตุแก้ว*
