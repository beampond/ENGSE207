# Week 7 — TaskBoard: Cloud Architecture + Docker Multi-Container

> ENGSE207 Software Architecture · มหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา  
> งานเดี่ยว (Individual Assignment)

---

## 👤 ข้อมูลผู้ทำ

| ชื่อ | อีเมล | บทบาท |
|------|-------|-------|
| ณัฏฐพงษ์ เรือนเทศ | nattapong.ru66@live.rmutl.ac.th | นักศึกษา |

---

## 🎯 วัตถุประสงค์

เพิ่ม **Nginx** เป็น Reverse Proxy / Load Balancer หน้า App Server แสดงให้เห็น Cloud Architecture ที่รองรับการ scale แบบ horizontal ได้ด้วย `--scale app=N`

---

## 🏗️ Architecture

```
                  Internet
                     │
                     ▼
         ┌───────────────────────┐
         │   nginx (port 80)     │  ← Reverse Proxy
         │   Load Balancer       │    + SSL Termination
         └───────────┬───────────┘
                     │ Round-Robin
          ┌──────────┴──────────┐
          ▼                     ▼
  ┌───────────────┐   ┌───────────────┐
  │  app (3003)   │   │  app (3003)   │  ← Scale ได้
  │  Instance 1   │   │  Instance 2   │
  └───────┬───────┘   └───────┬───────┘
          └──────────┬─────────┘
                     ▼
         ┌───────────────────────┐
         │   Docker Volume       │  ← Persistent Storage
         │   tasks.db            │
         └───────────────────────┘
```

---

## 📁 โครงสร้างโปรเจกต์

```
week7-cloud/
├── server.js
├── Dockerfile
├── docker-compose.yml      ← nginx + app + volume
├── nginx.conf              ← Reverse proxy config
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
# เปิด http://localhost:3003
```

### รันแบบ Docker (nginx + app) ✨
```bash
docker-compose up --build
# เปิด http://localhost:80 หรือ http://localhost
```

### Scale app หลาย instances 🚀
```bash
# รัน app 2 instances พร้อมกัน (nginx load balance ให้อัตโนมัติ)
docker-compose up --build --scale app=2

# รัน app 3 instances
docker-compose up --build --scale app=3
```

### คำสั่งตรวจสอบ
```bash
docker-compose ps                     # ดู containers ทั้งหมด
docker-compose logs -f nginx          # ดู nginx logs
docker-compose logs -f app            # ดู app logs
curl http://localhost/health          # ตรวจ app health
curl http://localhost/nginx-health    # ตรวจ nginx health
```

---

## 🐳 Docker Config

### docker-compose.yml
```yaml
services:
  nginx:                              # Reverse Proxy
    image: nginx:alpine
    ports: ["80:80"]
    depends_on: [app]

  app:                                # App Server (scalable)
    build: .
    volumes:
      - taskboard-data:/app/database
```

### nginx.conf
```nginx
upstream taskboard_app {
    server app:3003;    # Docker service name
}
server {
    listen 80;
    location / {
        proxy_pass http://taskboard_app;
    }
}
```

---

## 🔌 API Endpoints

ทุก request ผ่าน nginx ที่ `http://localhost`

| Method | Path | คำอธิบาย |
|--------|------|---------|
| GET | `/api/tasks` | ดึง tasks ทั้งหมด |
| GET | `/api/tasks/:id` | ดึง task เดียว |
| POST | `/api/tasks` | สร้าง task ใหม่ |
| PUT | `/api/tasks/:id` | แก้ไข task |
| DELETE | `/api/tasks/:id` | ลบ task |
| GET | `/health` | App health check |
| GET | `/nginx-health` | Nginx health check |

---

## 💡 สิ่งที่เรียนรู้

**ความแตกต่างจาก Week 6:**

| ด้าน | Week 6 N-Tier | Week 7 Cloud |
|------|--------------|--------------|
| Entry point | App โดยตรง (3002) | Nginx (port 80) |
| Load balancing | ไม่มี | Nginx round-robin |
| Scale | 1 instance เสมอ | `--scale app=N` |
| Production-ready | บางส่วน | ใกล้เคียง production |

**สิ่งที่ Cloud Architecture ต้องมี:**
- **Reverse Proxy** (nginx) — จุดเข้าเดียว, ซ่อน internal ports
- **Load Balancer** — กระจาย traffic ระหว่าง instances
- **Health Check** — ตรวจสอบ instance ที่ล่ม
- **Persistent Volume** — ข้อมูลไม่หายเมื่อ scale up/down
- **Stateless App** — ทุก instance ใช้ข้อมูลจากที่เดียวกัน

---

## 🔗 วิวัฒนาการตลอด Week 3-7

```
Week 3         Week 4          Week 5            Week 6          Week 7
Monolithic  →  Layered      →  Client-Server  →  Docker       →  Cloud
                                                  Container       nginx +
                                                                  multi-container
                                                                  scale ได้
```

---

*ENGSE207 Software Architecture — Week 7 · อ.ธนิต เกตุแก้ว*
