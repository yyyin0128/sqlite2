const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.static('public')); // 提供 index.html
app.use(express.json());

// 建立 SQLite 連線（放在 ./db/sqlite.db）
const dbPath = path.join(__dirname, 'db', 'sqlite.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ 資料庫連接失敗：', err.message);
    } else {
        console.log('✅ 已連接到 SQLite 資料庫');
    }
});

// 查詢 API：GET /api/prices?start=YYYY&end=YYYY
app.get('/api/prices', (req, res) => {
    const start = parseInt(req.query.start);
    const end = parseInt(req.query.end);
    if (!start || !end) return res.status(400).send('請提供 start 和 end');

    const sql = `SELECT * FROM McNuggets_price WHERE years BETWEEN ? AND ? ORDER BY years`;
    db.all(sql, [start, end], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// 啟動伺服器
app.listen(port, () => {
    console.log(`🚀 伺服器運行於 http://localhost:${port}`);
});
