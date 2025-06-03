const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sqlite3 = require('sqlite3').verbose();

const app = express();

// 中介層設定
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// 提供靜態檔案（前端網頁）
app.use(express.static(path.join(__dirname, 'public')));

// 連接 SQLite 資料庫
const db = new sqlite3.Database(path.join(__dirname, 'db', 'sqlite2.db'), (err) => {
    if (err) {
        console.error('無法開啟資料庫:', err.message);
    } else {
        console.log('✅ 已連接 SQLite 資料庫');
    }
});

// 建立資料表（若尚未存在）
db.run(`
  CREATE TABLE IF NOT EXISTS homework_price (
    years INTEGER PRIMARY KEY,
    food_name TEXT NOT NULL,
    price INTEGER NOT NULL
  )
`);

// 查詢 API：GET /api/prices?start=2005&end=2025
app.get('/api/prices', (req, res) => {
    const start = parseInt(req.query.start) || 1900;
    const end = parseInt(req.query.end) || 2100;
    const sql = `
    SELECT * FROM homework_price
    WHERE years BETWEEN ? AND ?
    ORDER BY years ASC
  `;
    db.all(sql, [start, end], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// 新增 API：POST /api/prices
app.post('/api/prices', (req, res) => {
    const { years, food_name, price } = req.body;
    if (!years || !food_name || !price) {
        return res.status(400).json({ error: '請填寫完整資料' });
    }

    const sql = `
    INSERT OR REPLACE INTO homework_price (years, food_name, price)
    VALUES (?, ?, ?)
  `;
    db.run(sql, [years, food_name, price], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: '新增成功', id: this.lastID });
    });
});

module.exports = app;
