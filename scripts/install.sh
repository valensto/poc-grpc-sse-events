#!/bin/bash

function install_in_dir() {
    cd "$1"
    npm install
}

install_in_dir "app" &
install_in_dir "internal/gateway" &

wait

make all

service_url="http://localhost:8080/ping"
while true; do
    status_code=$(curl -s -o /dev/null -w "%{http_code}" "$service_url")
    if [ "$status_code" = "200" ]; then
        echo "Service is up"
        break
    else
        echo "Service is not up yet. Waiting..."
        sleep 2
    fi
done