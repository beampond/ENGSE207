/**
 * Week 3 — TaskBoard: Monolithic Architecture
 * ─────────────────────────────────────────────
 * ทุกอย่างรวมในไฟล์เดียว:
 *   • HTTP server
 *   • Business logic + validation
 *   • Database access
 *   • Static file serving
 *
 * นี่คือลักษณะของ Monolithic Architecture
 */

const express = require('express');
const Database = require('better-sqlite3');
const path = require('fs') && require('path');
const fs   = require('fs');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Database (ติดอยู่ใน process เดียวกัน) ────────
const db = new Database(path.join(__dirname, 'database', 'tasks.db'));
db.pragma('journal_mode = WAL');
db.exec(fs.readFileSync(path.join(__dirname, 'database', 'schema.sql'), 'utf8'));

// ── Middleware ────────────────────────────────────
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── Routes + Logic + DB รวมกัน ───────────────────

app.get('/api/tasks', (req, res) => {
  const { status } = req.query;
  const rows = status
    ? db.prepare('SELECT * FROM tasks WHERE status=? ORDER BY created_at DESC').all(status)
    : db.prepare('SELECT * FROM tasks ORDER BY created_at DESC').all();
  res.json({ success: true, data: rows });
});

app.get('/api/tasks/:id', (req, res) => {
  const task = db.prepare('SELECT * FROM tasks WHERE id=?').get(req.params.id);
  if (!task) return res.status(404).json({ success: false, message: 'Not found' });
  res.json({ success: true, data: task });
});

app.post('/api/tasks', (req, res) => {
  const { title, description = '', status = 'todo' } = req.body;
  if (!title?.trim()) return res.status(400).json({ success: false, message: 'Title is required' });
  if (!['todo','in_progress','done'].includes(status))
    return res.status(400).json({ success: false, message: 'Invalid status' });

  const r = db.prepare('INSERT INTO tasks (title,description,status) VALUES (?,?,?)')
              .run(title.trim(), description.trim(), status);
  res.status(201).json({ success: true, data: db.prepare('SELECT * FROM tasks WHERE id=?').get(r.lastInsertRowid) });
});

app.put('/api/tasks/:id', (req, res) => {
  const task = db.prepare('SELECT * FROM tasks WHERE id=?').get(req.params.id);
  if (!task) return res.status(404).json({ success: false, message: 'Not found' });

  const title       = (req.body.title       ?? task.title).trim();
  const description = (req.body.description ?? task.description).trim();
  const status      =  req.body.status      ?? task.status;

  if (!title) return res.status(400).json({ success: false, message: 'Title is required' });
  if (!['todo','in_progress','done'].includes(status))
    return res.status(400).json({ success: false, message: 'Invalid status' });

  db.prepare('UPDATE tasks SET title=?,description=?,status=?,updated_at=CURRENT_TIMESTAMP WHERE id=?')
    .run(title, description, status, req.params.id);
  res.json({ success: true, data: db.prepare('SELECT * FROM tasks WHERE id=?').get(req.params.id) });
});

app.delete('/api/tasks/:id', (req, res) => {
  const task = db.prepare('SELECT * FROM tasks WHERE id=?').get(req.params.id);
  if (!task) return res.status(404).json({ success: false, message: 'Not found' });
  db.prepare('DELETE FROM tasks WHERE id=?').run(req.params.id);
  res.json({ success: true, message: 'Deleted' });
});

app.get('/api/stats', (req, res) => {
  res.json({ success: true, data: db.prepare(`
    SELECT COUNT(*) total,
      SUM(status='todo') todo,
      SUM(status='in_progress') in_progress,
      SUM(status='done') done
    FROM tasks`).get() });
});

// ── Start ─────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀  http://localhost:${PORT}`);
  console.log(`    Architecture: Monolithic (single process)`);
});
