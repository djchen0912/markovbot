const sqlite3 = require('sqlite3');
const path = require("path");
const fs = require('fs');

// Define the SQL statement to create a table
const createTableSql = `
    CREATE TABLE IF NOT EXISTS wordlist (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        current_word TEXT,
        possible_words TEXT
    )`;

module.exports = (dbName) => {
    const dbExists = fs.existsSync(path.join(__dirname, '..', 'data', dbName));

    let db = new sqlite3.Database(path.join(__dirname, '..', 'data', dbName), sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
        if(err) console.error(err.message);
        
        console.log(`Connected to ${dbName} database`);
    });

    if(!dbExists){
        //initialize basic setup of table schema
        db.run(createTableSql, (err) => {
            if (err) {
                return console.error('Error creating table:', err.message);
            }
            console.log('Table created successfully');
        });

    }
    
    return db;
};