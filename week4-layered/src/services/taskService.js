/**
 * Layer 2 — Business Logic Layer (Service)
 * ─────────────────────────────────────────
 * รับผิดชอบ: Validation + Business Rules
 * ไม่รู้จัก HTTP Request/Response
 * ไม่รู้จัก Database โดยตรง — คุยผ่าน Repository
 */

const repo = require('../repositories/taskRepository');

const VALID_STATUS = ['todo', 'in_progress', 'done'];

const TaskService = {
  getAll(status) {
    if (status && !VALID_STATUS.includes(status))
      throw { code: 400, message: 'Invalid status filter' };
    return repo.findAll(status);
  },

  getById(id) {
    const task = repo.findById(id);
    if (!task) throw { code: 404, message: 'Task not found' };
    return task;
  },

  create(body) {
    const { title, description = '', status = 'todo' } = body;
    if (!title?.trim())              throw { code: 400, message: 'Title is required' };
    if (!VALID_STATUS.includes(status)) throw { code: 400, message: 'Invalid status' };
    return repo.create(title.trim(), description.trim(), status);
  },

  update(id, body) {
    const existing = repo.findById(id);
    if (!existing) throw { code: 404, message: 'Task not found' };

    const title       = (body.title       ?? existing.title).trim();
    const description = (body.description ?? existing.description).trim();
    const status      =  body.status      ?? existing.status;

    if (!title)                          throw { code: 400, message: 'Title is required' };
    if (!VALID_STATUS.includes(status))  throw { code: 400, message: 'Invalid status' };
    return repo.update(id, title, description, status);
  },

  remove(id) {
    if (!repo.findById(id)) throw { code: 404, message: 'Task not found' };
    repo.remove(id);
  },

  stats() {
    return repo.stats();
  }
};

module.exports = TaskService;
