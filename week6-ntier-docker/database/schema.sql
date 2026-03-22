-- TaskBoard Database Schema (shared across all weeks)

CREATE TABLE IF NOT EXISTS tasks (
  id          INTEGER  PRIMARY KEY AUTOINCREMENT,
  title       TEXT     NOT NULL,
  description TEXT     DEFAULT "",
  status      TEXT     NOT NULL DEFAULT "todo"
                CHECK(status IN ("todo","in_progress","done")),
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO tasks (title, description, status) VALUES
  ("ออกแบบ Database Schema",  "วางแผนโครงสร้าง tables ทั้งหมด",       "done"),
  ("เขียน REST API",          "สร้าง CRUD endpoints สำหรับ tasks",      "in_progress"),
  ("ทำ Frontend UI",          "สร้างหน้าเว็บ Kanban Board",             "todo"),
  ("เขียน Unit Tests",        "ทดสอบ API แต่ละ endpoint",              "todo");
