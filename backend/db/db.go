package db

import (
	"database/sql"
	"fmt"

	_ "github.com/mattn/go-sqlite3"
)

var db *sql.DB

func MustInit(dbfile string) {
	var err error
	dsn := fmt.Sprintf("file:%s?cache=shared", dbfile)
	db, err = sql.Open("sqlite3", dsn)
	if err != nil {
		panic(err)
	}
	if err := db.Ping(); err != nil {
		panic(err)
	}
	if _, err := db.Exec(`
		CREATE TABLE IF NOT EXISTS users (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			fullname TEXT NOT NULL,
			email TEXT NOT NULL UNIQUE,
			password_hash TEXT NOT NULL
		);

		CREATE TABLE IF NOT EXISTS messages (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			sender_id INTEGER NOT NULL,
			receiver_id INTEGER NOT NULL,
			text TEXT NOT NULL,
			timestamp DATETIME NOT NULL,
			FOREIGN KEY (sender_id) REFERENCES users(id),
			FOREIGN KEY (receiver_id) REFERENCES users(id)
		);

		CREATE TABLE IF NOT EXISTS conversations (
			user1_id INTEGER NOT NULL,
			user2_id INTEGER NOT NULL,
			timestamp DATETIME NOT NULL,
			UNIQUE(user1_id, user2_id),
			FOREIGN KEY (user1_id) REFERENCES users(id),
			FOREIGN KEY (user2_id) REFERENCES users(id)
		);
	`); err != nil {
		panic(err)
	}
}

func Close() {
	db.Close()
}
