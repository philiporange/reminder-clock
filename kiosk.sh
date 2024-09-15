#!/bin/bash

URL="http://localhost:9999/"
CHROMIUM="/usr/bin/chromium-browser"

# Wait for server to start
sleep 5

while true; do
    echo "Starting $CHROMIUM"
    $CHROMIUM --kiosk --noerrdialogs --incognito "$URL"
    echo "Chromium closed with exit code $?. Respawning.."
    sleep 5
done

exit 0
