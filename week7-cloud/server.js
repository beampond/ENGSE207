/**
 * Week 7 — TaskBoard: Cloud Architecture
 * ──────────────────────────────────────────
 * Deploy บน Docker multi-container:
 *
 *   nginx  (port 80)  → reverse proxy / load balancer
 *   app    (port 3003) → API server (scale ได้หลาย instance)
 *   volume             → persistent database storage
 *
 * รัน local:  node server.js
 * รัน Cloud:  docker-compose up --scale app=2
 */

const express    = require('express');
const cors       = require('cors');
const path       = require('path');
const taskRoutes = require('./src/routes/taskRoutes');

const app  = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/tasks', taskRoutes);

// Health check + instance info (ดูได้ว่า nginx ส่งมาถึง instance ไหน)
app.get('/health', (req, res) => res.json({
  status:   'ok',
  instance: process.env.HOSTNAME || 'local',
  uptime:   Math.floor(process.uptime()),
  port:     PORT
}));

app.listen(PORT, () => {
  console.log(`🚀  http://localhost:${PORT}`);
  console.log(`    Architecture: Cloud + Docker Multi-Container`);
  console.log(`    Instance: ${process.env.HOSTNAME || 'local'}`);
});
