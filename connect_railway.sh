#!/bin/bash
DOMAIN="shinkansen.proxy.rlwy.net"
PORT="11854"
PASSWORD="mbHxuNVPxpsnZcfJwHzLJbXyeMYQpZka"

/opt/homebrew/opt/mysql-client/bin/mysql -h "$DOMAIN" -P "$PORT" -u root -p"$PASSWORD" railway < api/fix_view.sql

echo "✅ Vista actualizada correctamente"
