/**
 * Layer 1 — Presentation Layer (Routes)
 * ──────────────────────────────────────
 * รับผิดชอบ: รับ HTTP Request → เรียก Service → ส่ง Response
 * ไม่มี business logic ใดๆ ในนี้
 */

const express = require('express');
const router  = express.Router();
const svc     = require('../services/taskService');

const ok   = (res, data, code = 200) => res.status(code).json({ success: true,  data });
const fail = (res, err) => res.status(err.code || 500).json({ success: false, message: err.message });

router.get('/',       (req, res) => { try { ok(res, svc.getAll(req.query.status)); } catch(e) { fail(res, e); } });
router.get('/stats',  (req, res) => { try { ok(res, svc.stats()); }                catch(e) { fail(res, e); } });
router.get('/:id',    (req, res) => { try { ok(res, svc.getById(req.params.id)); } catch(e) { fail(res, e); } });
router.post('/',      (req, res) => { try { ok(res, svc.create(req.body), 201); }  catch(e) { fail(res, e); } });
router.put('/:id',    (req, res) => { try { ok(res, svc.update(req.params.id, req.body)); } catch(e) { fail(res, e); } });
router.delete('/:id', (req, res) => { try { svc.remove(req.params.id); ok(res, { message: 'Deleted' }); } catch(e) { fail(res, e); } });

module.exports = router;
