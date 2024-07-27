package db

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
)

var pool *pgxpool.Pool

func MustInit(dburl string) {
	var err error
	pool, err = pgxpool.New(context.Background(), dburl)
	if err != nil {
		panic(err)
	}
	err = pool.Ping(context.Background())
	if err != nil {
		panic(err)
	}
}

func Close() {
	pool.Close()
}
