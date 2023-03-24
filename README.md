# LPIOTIA2023_Resilience_Handicap

# part by part
docker compose -f ./db/docker-compose.yml up -d
docker compose -f ./caddy/docker-compose.yml up -d
docker compose -f ./backend/docker-compose.yml up -d

# all
docker compose -f ./db/docker-compose.yml up -d && docker compose -f ./caddy/docker-compose.yml up -d && docker compose -f ./backend/docker-compose.yml up -d