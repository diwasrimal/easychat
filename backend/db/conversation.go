package db

import (
	"time"

	"github.com/diwasrimal/easychat/backend/models"
)

func GetConversationsOf(userId uint64) ([]models.Conversation, error) {
	var conversations []models.Conversation
	rows, err := db.Query(
		"SELECT * FROM conversations WHERE "+
			"user1_id = $1 OR user2_id = $1 "+
			"ORDER BY timestamp DESC",
		userId,
	)
	if err != nil {
		return conversations, err
	}
	defer rows.Close()
	for rows.Next() {
		var conv models.Conversation
		if err := rows.Scan(&conv.UserId1, &conv.UserId2, &conv.Timestamp); err != nil {
			return conversations, err
		}
		conversations = append(conversations, conv)
	}
	return conversations, nil // TODO: maybe add limit
}

// Updates an exsiting conversation's timestamp between two users
// or creates a new one
func UpdateOrCreateConversation(senderId, receiverId uint64, timestamp time.Time) error {
	// Always keep the samllest id as user1_id during insertion
	// to keep uniqueness
	user1Id, user2Id := senderId, receiverId
	if user1Id > user2Id {
		user1Id, user2Id = user2Id, user1Id
	}
	_, err := db.Exec(
		`INSERT INTO conversations(user1_id, user2_id, timestamp)
	 		VALUES ($1, $2, $3)
			ON CONFLICT(user1_id, user2_id)
			DO UPDATE SET timestamp = excluded.timestamp`,
		user1Id,
		user2Id,
		timestamp,
	)
	return err
}
