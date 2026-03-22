# Week 6 — TaskBoard: N-Tier Architecture + Docker

> ENGSE207 Software Architecture · มหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา  
> งานเดี่ยว (Individual Assignment)

---

## 👤 ข้อมูลผู้ทำ

| ชื่อ | อีเมล | บทบาท |
|------|-------|-------|
| ณัฏฐพงษ์ เรือนเทศ | nattapong.ru66@live.rmutl.ac.th | นักศึกษา |

---

## 🎯 วัตถุประสงค์

นำ Layered Architecture มา **Containerize ด้วย Docker** แสดงให้เห็น N-Tier ที่แต่ละ tier สามารถ deploy แยกกันบน container ต่างๆ ได้

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                N-Tier Architecture                  │
│                                                     │
│  Tier 1: Client                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  Browser (public/)                          │   │
│  └────────────────────┬────────────────────────┘   │
│                       │ HTTP                        │
│  Tier 2: Web Server                                 │
│  ┌────────────────────▼────────────────────────┐   │
│  │  Express Server  [Docker Container: app]    │   │
│  │  port 3002                                  │   │
│  └────────────────────┬────────────────────────┘   │
│                       │                             │
│  Tier 3: Application Logic                          │
│  ┌────────────────────▼────────────────────────┐   │
│  │  Services + Repositories                    │   │
│  │  (รันใน container เดียวกับ Tier 2)           │   │
│  └────────────────────┬────────────────────────┘   │
│                       │                             │
│  Tier 4: Data                                       │
│  ┌────────────────────▼────────────────────────┐   │
│  │  SQLite  [Docker Volume: taskboard-data]    │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

---

## 📁 โครงสร้างโปรเจกต์

```
week6-ntier-docker/
├── server.js
├── Dockerfile              ← สร้าง container image
├── docker-compose.yml      ← จัดการ container + volume
├── package.json
├── src/
│   ├── routes/taskRoutes.js
│   ├── services/taskService.js
│   └── repositories/taskRepository.js
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

### รันแบบปกติ (ไม่ใช้ Docker)
```bash
npm install
npm run dev
# เปิด http://localhost:3002
```

### รันแบบ Docker ✨
```bash
# Build image และรัน container
docker-compose up --build

# เปิด http://localhost:3002
```

### คำสั่ง Docker ที่ใช้บ่อย
```bash
docker-compose up -d          # รันแบบ background
docker-compose logs -f app    # ดู logs แบบ real-time
docker-compose ps             # ดู containers ที่รันอยู่
docker-compose down           # หยุดและลบ containers
docker-compose down -v        # หยุด + ลบ volume ด้วย (ข้อมูลหาย)
docker-compose restart        # restart containers
```

---

## 🐳 Docker Config

### Dockerfile
```dockerfile
FROM node:20-alpine       # base image เบา
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3002
CMD ["node", "server.js"]
```

### docker-compose.yml
```yaml
services:
  app:
    build: .
    ports: ["3002:3002"]
    volumes:
      - taskboard-data:/app/database   # ← ข้อมูลไม่หายเมื่อ restart
```

**Health check:** `GET /health` → ตรวจสอบว่า container พร้อมใช้งาน

---

## 🔌 API Endpoints

| Method | Path | คำอธิบาย |
|--------|------|---------|
| GET | `/api/tasks` | ดึง tasks ทั้งหมด |
| GET | `/api/tasks/:id` | ดึง task เดียว |
| POST | `/api/tasks` | สร้าง task ใหม่ |
| PUT | `/api/tasks/:id` | แก้ไข task |
| DELETE | `/api/tasks/:id` | ลบ task |
| GET | `/health` | Docker health check |

---

## 💡 สิ่งที่เรียนรู้

**ประโยชน์ของ Docker ที่เห็น:**
- รันได้เหมือนกันทุกเครื่อง ไม่มีปัญหา "รันได้ที่เครื่องฉัน"
- `docker-compose down && docker-compose up` ได้ environment ใหม่เสมอ
- Volume ทำให้ข้อมูลใน Database ไม่หายแม้ container ถูกลบ

**ความแตกต่างจาก Week 5:**

| ด้าน | Week 5 | Week 6 |
|------|--------|--------|
| Deploy | `npm run dev` | `docker-compose up` |
| Environment | ขึ้นอยู่กับเครื่อง | Isolated container |
| Data persistence | ไฟล์ใน local | Docker Volume |
| Health check | ไม่มี | `GET /health` |

---

*ENGSE207 Software Architecture — Week 6 · อ.ธนิต เกตุแก้ว*
