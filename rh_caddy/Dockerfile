FROM caddy:latest

RUN apk update && \
    apk add --no-cache nss
    
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]