## Easychat

Your chats made easy. A simple chat application made with Go, SQLite and React.

### Build and run for development

1. Clone
```sh
git clone https://github.com/diwasrimal/easychat.git
cd easychat
```

2. Run backend

Before running, copy over `.env.example` as `.env` and fill in the environment
variables

```sh
cd backend
go run .
```

3. Run frontend

A proxy is set up at `frontend/vite.config.js` to redirect requests to the backend API.
which  is the default port where the backend server runs. If you changed the `SERVER_PORT` in
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

1. Build the backend binary
```sh
cd backend
go build -ldflags '-s -w' -o app .
```

2. Build frontend files and copy them to backend directory
```sh
cd frontend
npm run build
cp -r dist ../backend/
```

3. Start the backend application
```sh
cd ../backend
./app # or .\app.exe on windows
```
