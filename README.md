## Easychat

Your chats made easy. 

### Build

1. Clone
```
git clone https://github.com/diwasrimal/easychat.git
cd easychat
```

1. Run backend
```
cd backend
createdb easychat_db
psql -d easychat_db -f ./db/sql/create_tables.sql
go run .
```

2. run frontend
```
cd frontend
npm install
npm run dev
```
