#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

while true; do
    echo "Starting server..."
    cd "$DIR/static"
    python3 -m http.server 9999
    echo "Server stopped. Restarting in 5 seconds..."
    sleep 5
done

exit 0
