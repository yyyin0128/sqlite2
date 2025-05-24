const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

// 建立 SQLite 資料庫連線（放在 ./db/sqlite.db）
const db = new sqlite3.Database(path.join(__dirname, 'db', 'sqlite2.db'), (err) => {
    if (err) {
        return console.error('資料庫連線錯誤：', err.message);
    }
    console.log('✅ 已連線到 SQLite 資料庫');
});

// 中介軟體
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // 提供 index.html

// 查詢 API
app.get('/api/prices', (req, res) => {
    const start = parseInt(req.query.start);
    const end = parseInt(req.query.end);

    if (!start || !end) {
        return res.status(400).json({ error: '請提供 start 和 end 年份' });
    }

    const sql = `SELECT * FROM homework_price WHERE years BETWEEN ? AND ? ORDER BY years ASC`;
    db.all(sql, [start, end], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// 啟動伺服器
app.listen(port, () => {
    console.log(`🚀 伺服器已啟動：http://localhost:${port}`);
});

module.exports = app;