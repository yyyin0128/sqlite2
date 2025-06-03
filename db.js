const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbDir = path.join(__dirname, 'db');
const dbPath = path.join(dbDir, 'sqlite2.db');

// 確保 db 目錄存在
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir);
}

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        return console.error('資料庫開啟失敗:', err.message);
    }
    console.log('已連接到 SQlite 資料庫。');

    // 建立 homework_price table（若不存在）
    db.run(`CREATE TABLE IF NOT EXISTS homework_price (
        years INTEGER PRIMARY KEY,
        food_name TEXT NOT NULL,
        price INTEGER NOT NULL
    )`, (err) => {
        if (err) {
            return console.error('建立 homework_price table 失敗:', err.message);
        }
        console.log('homework_price table 已確認存在。');
        // 新增指定資料
        const data = [
            [2025, '麥克雞塊(六塊)', 69],
            [2024, '麥克雞塊(六塊)', 68],
            [2023, '麥克雞塊(六塊)', 66],
            [2022, '麥克雞塊(六塊)', 64],
            [2021, '麥克雞塊(六塊)', 64],
            [2020, '麥克雞塊(六塊)', 60],
            [2019, '麥克雞塊(六塊)', 60],
            [2018, '麥克雞塊(六塊)', 60]
        ];
        const insertSQL = 'INSERT OR IGNORE INTO homework_price (years, food_name, price) VALUES (?, ?, ?)';
        data.forEach(row => {
            db.run(insertSQL, row, (err) => {
            });
        });
        console.log('已批次新增 homework_price 資料。');
    });
});

module.exports = db;
