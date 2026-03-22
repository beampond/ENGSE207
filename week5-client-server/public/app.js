// Week 5 — Client-Server
// Client (browser) เรียก API Server แยก port
const API = 'http://localhost:3001/api/tasks';

async function load() {
  const [tasksRes, statsRes] = await Promise.all([
    fetch(API),
    fetch('http://localhost:3001/api/tasks/stats').catch(() => null)
  ]);
  const { data: tasks } = await tasksRes.json();

  // คำนวณ stats จาก tasks ที่ได้มา
  const stats = {
    total:       tasks.length,
    todo:        tasks.filter(t => t.status === 'todo').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    done:        tasks.filter(t => t.status === 'done').length,
  };

  ['todo','in_progress','done'].forEach(s => {
    const items = tasks.filter(t => t.status === s);
    document.getElementById(`c-${s}`).textContent   = items.length;
    document.getElementById(`cards-${s}`).innerHTML = items.length
      ? items.map(card).join('') : '<div class="empty-col">ยังไม่มี Task</div>';
  });
  document.getElementById('s-total').textContent = stats.total;
  document.getElementById('s-todo').textContent  = stats.todo;
  document.getElementById('s-prog').textContent  = stats.in_progress;
  document.getElementById('s-done').textContent  = stats.done;
}

function card(t) {
  const d = new Date(t.created_at).toLocaleDateString('th-TH');
  return `<div class="card">
    <div class="card-title">${esc(t.title)}</div>
    <div class="card-desc">${esc(t.description||'')}</div>
    <div class="card-meta">สร้าง ${d}</div>
    <div class="card-actions">
      <button class="btn btn-edit" onclick="openEdit(${t.id})">✏️ แก้ไข</button>
      <button class="btn btn-del"  onclick="del(${t.id})">🗑️ ลบ</button>
    </div>
  </div>`;
}

document.getElementById('addForm').addEventListener('submit', async e => {
  e.preventDefault();
  const title = document.getElementById('fTitle').value.trim();
  if (!title) return;
  await fetch(API, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title,
      description: document.getElementById('fDesc').value.trim(),
      status:      document.getElementById('fStatus').value
    })
  });
  document.getElementById('fTitle').value = '';
  document.getElementById('fDesc').value  = '';
  load();
});

async function del(id) {
  if (!confirm('ลบ Task นี้?')) return;
  await fetch(`${API}/${id}`, { method: 'DELETE' });
  load();
}

async function openEdit(id) {
  const { data: t } = await (await fetch(`${API}/${id}`)).json();
  document.getElementById('eId').value     = t.id;
  document.getElementById('eTitle').value  = t.title;
  document.getElementById('eDesc').value   = t.description || '';
  document.getElementById('eStatus').value = t.status;
  document.getElementById('overlay').classList.add('active');
}

document.getElementById('btnCancel').onclick = () =>
  document.getElementById('overlay').classList.remove('active');

document.getElementById('btnSave').onclick = async () => {
  const id = document.getElementById('eId').value;
  await fetch(`${API}/${id}`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title:       document.getElementById('eTitle').value.trim(),
      description: document.getElementById('eDesc').value.trim(),
      status:      document.getElementById('eStatus').value
    })
  });
  document.getElementById('overlay').classList.remove('active');
  load();
};

const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
load();
