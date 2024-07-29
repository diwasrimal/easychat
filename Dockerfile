FROM node:20-alpine as frontend-builder
WORKDIR /frontend

COPY frontend/package.json frontend/package-lock.json ./
RUN npm install
COPY frontend ./
RUN npm run build


FROM alpine as backend-builder
RUN apk add --no-cache --update go gcc g++
WORKDIR /backend

COPY backend/go.sum backend/go.mod ./
RUN go mod download
COPY backend  ./
RUN CGO_ENABLED=1 GOOS=linux go build -ldflags '-s -w' -o app .

# Use a lightweight image for final distribution
# Copy frontend the backend executable, backend .env file
# and frontend dist files and serve
FROM alpine
WORKDIR /app
COPY --from=frontend-builder frontend/dist ./dist
COPY --from=backend-builder backend/app ./

EXPOSE 3030

CMD ["./app"]
