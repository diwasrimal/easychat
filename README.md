## Easychat

Your chats made easy.

### Build and run for development

1. Clone
```sh
git clone https://github.com/diwasrimal/easychat.git
cd easychat
```

2. Run backend

Copy over `.env.example` as `.env` and put correct environment
variables there including PostgreSQL url, jwt secret key and others.
To run the server in development mode allowing CORS, set `MODE="dev"`

```sh
cd backend
createdb easychat_db
psql -d easychat_db -f ./db/sql/create_tables.sql
go run .
```

3. Run frontend

A proxy is set up at `frontend/vite.config.js` to to redirect requests to `localhost:3030`,
 which  is the default backend API url. If you changed the `SERVER_ADDR` in
`backend/.env` you need to update the vite config file to match the changed port.

```sh
cd frontend
npm install
npm run preview
```

### Build as standalone server for production

In this case, the frontend build files are served are by our
backend server. We copy the the generated files and put then
alongside backend and use a fileserver to serve them.

1. Build backend with `MODE="prod"` set in `.env` file

2. Build frontend files and copy them to backend directory
```sh
cd frontend
npm run build
cp -r dist ../backend/
```

3. Start the backend server
```sh
cd ../backend
./backend # or .\backend.exe on windows
```
