#!/usr/bin/env bash
set -Eeuo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$APP_DIR"

PM2_NAME="${PM2_NAME:-dropmini}"
PORT="${PORT:-40322}"
APP_USER="${APP_USER:-$(id -un)}"
APP_GROUP="${APP_GROUP:-$(id -gn "$APP_USER" 2>/dev/null || id -gn)}"

read_env_value() {
  local key="$1"
  local file="$APP_DIR/.env.local"
  if [[ ! -f "$file" ]]; then
    return 0
  fi

  awk -F= -v key="$key" '
    $0 !~ /^[[:space:]]*#/ && $1 == key {
      sub(/^[^=]*=/, "")
      gsub(/^[[:space:]]+|[[:space:]]+$/, "")
      gsub(/^"|"$/, "")
      gsub(/^'\''|'\''$/, "")
      print
      exit
    }
  ' "$file"
}

ENV_UPLOAD_DIR="$(read_env_value UPLOAD_DIR || true)"
UPLOAD_DIR="${UPLOAD_DIR:-${ENV_UPLOAD_DIR:-$APP_DIR/public/uploads}}"
DATA_DIR="${DATA_DIR:-$APP_DIR/data}"
LOG_DIR="${LOG_DIR:-$APP_DIR/logs}"

if [[ "$UPLOAD_DIR" != /* ]]; then
  UPLOAD_DIR="$APP_DIR/$UPLOAD_DIR"
fi

if [[ "$DATA_DIR" != /* ]]; then
  DATA_DIR="$APP_DIR/$DATA_DIR"
fi

if [[ "$LOG_DIR" != /* ]]; then
  LOG_DIR="$APP_DIR/$LOG_DIR"
fi

ensure_command() {
  local command_name="$1"
  if ! command -v "$command_name" >/dev/null 2>&1; then
    echo "Missing command: $command_name"
    exit 1
  fi
}

prepare_dir() {
  local dir="$1"
  mkdir -p "$dir"

  if [[ "$(id -u)" -eq 0 ]]; then
    chown -R "$APP_USER:$APP_GROUP" "$dir"
  fi

  chmod -R u+rwX,g+rwX,o+rX "$dir"
}

ensure_command node
ensure_command npm

prepare_dir "$DATA_DIR"
prepare_dir "$UPLOAD_DIR"
prepare_dir "$LOG_DIR"

echo "App dir: $APP_DIR"
echo "Data dir: $DATA_DIR"
echo "Upload dir: $UPLOAD_DIR"
echo "Log dir: $LOG_DIR"
echo "Port: $PORT"
echo "PM2 app: $PM2_NAME"

npm install
npm run build

if ! command -v pm2 >/dev/null 2>&1; then
  echo "PM2 is not installed. Installing PM2 globally..."
  npm install -g pm2
fi

if pm2 describe "$PM2_NAME" >/dev/null 2>&1; then
  pm2 delete "$PM2_NAME"
fi

PORT="$PORT" UPLOAD_DIR="$UPLOAD_DIR" pm2 start npm \
  --name "$PM2_NAME" \
  --output "$LOG_DIR/$PM2_NAME.out.log" \
  --error "$LOG_DIR/$PM2_NAME.error.log" \
  -- start

pm2 save
pm2 status "$PM2_NAME"

echo "Started. View logs with: pm2 logs $PM2_NAME"
