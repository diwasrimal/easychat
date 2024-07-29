# Easychat

Your chats made easy. A simple chat application made with Go, SQLite and React.

## Quick Build

```sh
git clone https://github.com/diwasrimal/easychat.git
cp .env.example .env

cd easychat/frontend
npm install
npm run build
cp -r dist ../backend/

cd ../backend
go build -ldflags '-s -w' -o app .
```

Before running the server, edit the secret key `JWT_SECRET` inside `.env`.
Then from inside the `backend` directory, run
```sh
./app # or .\app.exe on windows
```

## Using docker
In the project root run, after setting up `.env` file,

```sh
docker compose build
docker compose run
```


