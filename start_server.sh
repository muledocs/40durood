#!/bin/bash

# Simple script to start a local web server for the Durood Sharif web app

echo "🚀 Starting Durood Sharif Web Application..."
echo ""
echo "Choose your preferred server:"
echo "1. Python HTTP Server (default)"
echo "2. Node.js http-server"
echo "3. PHP Built-in Server"
echo ""
read -p "Enter choice (1-3) [default: 1]: " choice
choice=${choice:-1}

cd "$(dirname "$0")/web"

case $choice in
    1)
        echo "Starting Python HTTP Server on port 8000..."
        echo "Open http://localhost:8000 in your browser"
        python3 -m http.server 8000
        ;;
    2)
        echo "Starting Node.js http-server on port 8000..."
        echo "Open http://localhost:8000 in your browser"
        npx http-server -p 8000
        ;;
    3)
        echo "Starting PHP Built-in Server on port 8000..."
        echo "Open http://localhost:8000 in your browser"
        php -S localhost:8000
        ;;
    *)
        echo "Invalid choice. Using Python HTTP Server..."
        python3 -m http.server 8000
        ;;
esac

