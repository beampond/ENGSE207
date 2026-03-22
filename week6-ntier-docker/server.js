/**
 * Week 6 — TaskBoard: N-Tier Architecture + Docker
 * ─────────────────────────────────────────────────
 * N-Tier แบ่งเป็น 4 ชั้น deploy แยกกันได้:
 *
 *   Tier 1  Client    → public/ (browser)
 *   Tier 2  Web/API   → server.js  (port 3002)
 *   Tier 3  App Logic → src/services/
 *   Tier 4  Database  → SQLite (จะเปลี่ยนเป็น container ใน Docker)
 *
 * รัน local:  node server.js
 * รัน Docker: docker-compose up
 */

const express    = require('express');
const cors       = require('cors');
const path       = require('path');
const taskRoutes = require('./src/routes/taskRoutes');

const app  = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/tasks', taskRoutes);

// Health check endpoint (สำหรับ Docker)
app.get('/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

app.listen(PORT, () => {
  console.log(`🚀  http://localhost:${PORT}`);
  console.log(`    Architecture: N-Tier + Docker`);
  console.log(`    Health: http://localhost:${PORT}/health`);
});
