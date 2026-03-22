# ENGSE207 — Software Architecture

> มหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา · ภาคเรียนที่ 2/2568

TaskBoard เดียวกัน พัฒนา architecture ต่อยอดทุก week

---

## 📁 โครงสร้าง Repository

```
ENGSE207/
├── week3-monolithic/       ← Week 3: ทุกอย่างในไฟล์เดียว
├── week4-layered/          ← Week 4: แยก routes/services/repositories
├── week5-client-server/    ← Week 5: Client (browser) ↔ API Server แยก port
├── week6-ntier-docker/     ← Week 6: N-Tier + Docker container
├── week7-cloud/            ← Week 7: Cloud, Docker multi-container + nginx
├── .gitignore
└── README.md
```

---

## 🚀 วิธีรันแต่ละ Week

### Week 3 — Monolithic
```bash
cd week3-monolithic
npm install
npm run dev
# เปิด http://localhost:3000
```
> ทุกอย่างรวมใน `server.js` ไฟล์เดียว

---

### Week 4 — Layered Architecture
```bash
cd week4-layered
npm install
npm run dev
# เปิด http://localhost:3000
```
> แยกเป็น 3 layers: `routes/` → `services/` → `repositories/`

---

### Week 5 — Client-Server Architecture
```bash
# Terminal 1: รัน API Server
cd week5-client-server
npm install
npm run dev
# API อยู่ที่ http://localhost:3001

# Terminal 2: เปิด Client
# เปิดไฟล์ week5-client-server/public/index.html ด้วย Live Server
# (VS Code → คลิกขวา index.html → Open with Live Server)
```
> Server (port 3001) แยกจาก Client (browser) ชัดเจน

---

### Week 6 — N-Tier + Docker

**รันแบบ Local (ไม่ใช้ Docker):**
```bash
cd week6-ntier-docker
npm install
npm run dev
# เปิด http://localhost:3002
```

**รันแบบ Docker:**
```bash
cd week6-ntier-docker
docker-compose up --build
# เปิด http://localhost:3002
```

**คำสั่ง Docker ที่ใช้บ่อย:**
```bash
docker-compose up -d          # รันแบบ background
docker-compose logs -f        # ดู logs
docker-compose down           # หยุด + ลบ container
docker-compose down -v        # หยุด + ลบทั้ง volume (ข้อมูลหาย)
```

---

### Week 7 — Cloud + Docker Multi-Container

**รันแบบ Local (ไม่ใช้ Docker):**
```bash
cd week7-cloud
npm install
npm run dev
# เปิด http://localhost:3003
```

**รันแบบ Docker (nginx + app):**
```bash
cd week7-cloud
docker-compose up --build
# เปิด http://localhost:80
```

**Scale app หลาย instance:**
```bash
docker-compose up --build --scale app=2
# nginx จะ load balance ระหว่าง 2 instances อัตโนมัติ
```

**ตรวจสอบ:**
```bash
docker-compose ps             # ดู containers ที่รันอยู่
curl http://localhost/health  # ตรวจ health check
curl http://localhost/nginx-health
```

---

## 🏗️ วิวัฒนาการ Architecture

```
Week 3          Week 4              Week 5                Week 6              Week 7
────────────    ────────────────    ──────────────────    ────────────────    ─────────────────
server.js       server.js           server.js             Dockerfile          nginx + app
(ทุกอย่าง       src/                (API only)            docker-compose      docker-compose
 รวมกัน)        ├─ routes/          public/               (N-Tier             --scale app=2
                ├─ services/        (Client แยก)           containerized)      (Cloud ready)
                └─ repositories/

port: 3000      port: 3000          port: 3001            port: 3002          port: 80
```

---

## 🔌 API Endpoints (ทุก Week เหมือนกัน)

| Method | Path | คำอธิบาย |
|--------|------|---------|
| `GET` | `/api/tasks` | ดึง tasks ทั้งหมด |
| `GET` | `/api/tasks?status=todo` | กรองตาม status |
| `GET` | `/api/tasks/:id` | ดึง task เดียว |
| `POST` | `/api/tasks` | สร้าง task ใหม่ |
| `PUT` | `/api/tasks/:id` | แก้ไข task |
| `DELETE` | `/api/tasks/:id` | ลบ task |
| `GET` | `/health` | Health check (week 6-7) |

---

## 📦 Requirements

- Node.js 20+
- npm 10+
- Docker Desktop (week 6-7)

---

*ENGSE207 Software Architecture · อ.ธนิต เกตุแก้ว*
