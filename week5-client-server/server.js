/**
 * Week 5 — TaskBoard: Client-Server Architecture
 * ─────────────────────────────────────────────────
 * แยก Server กับ Client ออกจากกันชัดเจน:
 *
 *   Server (port 3001) → API only, ไม่ serve static files
 *   Client (public/)   → เปิดด้วย Live Server / browser โดยตรง
 *
 * Client ส่ง HTTP Request → Server ประมวลผล → ส่ง JSON กลับ
 *
 * โครงสร้างใน:
 *   src/routes/      → Layer 1: Presentation
 *   src/services/    → Layer 2: Business Logic
 *   src/repositories/→ Layer 3: Data Access
 */

const express    = require('express');
const cors       = require('cors');
const taskRoutes = require('./src/routes/taskRoutes');

const app  = express();
const PORT = process.env.PORT || 3001;   // ← port ต่างจาก week3-4

// CORS: อนุญาตให้ Client คนละ origin เรียกได้
app.use(cors());
app.use(express.json());

// Pure API server — ไม่มี static file serving
app.use('/api/tasks', taskRoutes);

app.get('/', (req, res) => res.json({
  message: 'TaskBoard API Server (Week 5)',
  architecture: 'Client-Server',
  docs: 'GET /api/tasks | POST /api/tasks | PUT /api/tasks/:id | DELETE /api/tasks/:id'
}));

app.listen(PORT, () => {
  console.log(`🚀  API Server: http://localhost:${PORT}`);
  console.log(`    Architecture: Client-Server`);
  console.log(`    Client: เปิด public/index.html ด้วย Live Server`);
});
