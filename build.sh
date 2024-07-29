#!/bin/bash

# Builds a production ready server,
# that also serves frontend build files

set -e

cp .env.example .env

# Generate frontend dist files and copy to backend
echo "Building frontend files..."
cd frontend
npm install
npm run build
cp -r dist ../backend/

echo -e "\nBuilding backend executable..."
cd ../backend
go build -ldflags '-s -w' -o app .

echo -e "\nBuilt server executable: ./backend/app"
echo "Edit JWT_SECRET in .env before running the server"
