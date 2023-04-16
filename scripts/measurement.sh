#!/bin/bash

while true
do
  value=$((RANDOM%71-30))  # Valeur aléatoire entre -30 et 40
  curl --location 'http://localhost:4000/sensors/bosh-a1/measurement' \
       --header 'Content-Type: application/json' \
       --data "{
                 \"projectId\": \"project-1\",
                 \"field\": \"temperature\",
                 \"value\": ${value}
               }"
  sleep 2
done