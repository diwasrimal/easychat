package db

import (
	"database/sql"

	"github.com/diwasrimal/easychat/backend/models"
)

func CreateUser(fullname, email, passwordHash string) error {
	_, err := db.Exec(
		"INSERT INTO users(fullname, email, password_hash) VALUES($1, $2, $3)",
		fullname,
		email,
		passwordHash,
	)
	return err
}

func GetUserByEmail(email string) (*models.User, error) {
	var user models.User
	if err := db.QueryRow(
		"SELECT * FROM users WHERE email = $1",
		email,
	).Scan(&user.Id, &user.Fullname, &user.Email, &user.PasswordHash); err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	return &user, nil
}

func GetUserById(id uint64) (*models.User, error) {
	var user models.User
	if err := db.QueryRow(
		"SELECT * FROM users WHERE id = $1",
		id,
	).Scan(&user.Id, &user.Fullname, &user.Email, &user.PasswordHash); err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	return &user, nil
}

func IsEmailRegistered(email string) (bool, error) {
	rows, err := db.Query(
		"SELECT id FROM users WHERE email = $1",
		email,
	)
	if err != nil {
		return false, err
	}
	defer rows.Close()
	return rows.Next(), nil
}

func GetRecentChatPartners(userId uint64) ([]models.User, error) {
	var partners []models.User
	rows, err := db.Query(
		`SELECT u.* FROM users u
			JOIN (
			    SELECT
			        CASE
			            WHEN user1_id = $1 THEN user2_id
			            ELSE user1_id
			        END AS id,
			        timestamp
			    FROM conversations
			    WHERE user1_id = $1 OR user2_id = $1
			) as subq
			ON u.id = subq.id
			ORDER BY subq.timestamp DESC`,
		userId,
	)
	if err != nil {
		return partners, err
	}
	defer rows.Close()
	for rows.Next() {
		var user models.User
		if err := rows.Scan(&user.Id, &user.Fullname, &user.Email, &user.PasswordHash); err != nil {
			return partners, err
		}
		partners = append(partners, user)
	}
	return partners, nil // TODO: maybe add limit
}

func SearchUser(name string) ([]models.User, error) {
	var matches []models.User
	rows, err := db.Query(
		`SELECT * FROM users WHERE LOWER(fullname) LIKE '%' || LOWER($1) || '%'`,
		name,
	)
	if err != nil {
		return matches, err
	}
	defer rows.Close()
	for rows.Next() {
		var user models.User
		if err := rows.Scan(&user.Id, &user.Fullname, &user.Email, &user.PasswordHash); err != nil {
			return matches, err
		}
		matches = append(matches, user)
	}
	return matches, nil // TODO: maybe add limit
}
