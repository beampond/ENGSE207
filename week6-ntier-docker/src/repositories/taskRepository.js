/**
 * Layer 3 — Data Access Layer (Repository)
 * ─────────────────────────────────────────
 * รับผิดชอบ: ติดต่อ Database โดยตรง
 * ไม่มี business logic ใดๆ ในนี้
 */

const Database = require('better-sqlite3');
const path     = require('path');
const fs       = require('fs');

const DB_PATH = path.join(__dirname, '../../database/tasks.db');
const SQL     = path.join(__dirname, '../../database/schema.sql');

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.exec(fs.readFileSync(SQL, 'utf8'));

const TaskRepository = {
  findAll(status) {
    return status
      ? db.prepare('SELECT * FROM tasks WHERE status=? ORDER BY created_at DESC').all(status)
      : db.prepare('SELECT * FROM tasks ORDER BY created_at DESC').all();
  },
  findById(id) {
    return db.prepare('SELECT * FROM tasks WHERE id=?').get(id);
  },
  create(title, description, status) {
    const r = db.prepare('INSERT INTO tasks (title,description,status) VALUES (?,?,?)').run(title, description, status);
    return this.findById(r.lastInsertRowid);
  },
  update(id, title, description, status) {
    db.prepare('UPDATE tasks SET title=?,description=?,status=?,updated_at=CURRENT_TIMESTAMP WHERE id=?')
      .run(title, description, status, id);
    return this.findById(id);
  },
  remove(id) {
    return db.prepare('DELETE FROM tasks WHERE id=?').run(id);
  },
  stats() {
    return db.prepare(`SELECT COUNT(*) total, SUM(status='todo') todo,
      SUM(status='in_progress') in_progress, SUM(status='done') done FROM tasks`).get();
  }
};

module.exports = TaskRepository;
