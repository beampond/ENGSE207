/**
 * Week 4 — TaskBoard: Layered Architecture
 * ─────────────────────────────────────────────
 * แยกออกเป็น 3 layers:
 *
 *   Presentation  →  src/routes/taskRoutes.js
 *   Business      →  src/services/taskService.js
 *   Data Access   →  src/repositories/taskRepository.js
 *
 * server.js ทำหน้าที่แค่ bootstrap เท่านั้น
 */

const express  = require('express');
const path     = require('path');
const taskRoutes = require('./src/routes/taskRoutes');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/tasks', taskRoutes);

app.listen(PORT, () => {
  console.log(`🚀  http://localhost:${PORT}`);
  console.log(`    Architecture: Layered (routes → services → repositories)`);
});
