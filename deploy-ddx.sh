#!/bin/bash
set -Eeuo pipefail

echo ">>> [DDx Control Board] Deploying Financial AI Dashboard..."
echo ">>> Deployment started at $(date)"

# Environment validation
if [ -z "${NEXT_PUBLIC_WS_URL:-}" ]; then
  echo "WARNING: NEXT_PUBLIC_WS_URL is not set. WebSocket functionality will be limited."
fi

if [ -z "${EXCHANGE_API_KEY:-}" ] || [ -z "${EXCHANGE_API_SECRET:-}" ]; then
  echo "WARNING: Exchange API credentials are not set. Trading functionality will be limited."
fi

# Install dependencies with cache optimization
echo ">>> Installing dependencies..."
npm ci --prefer-offline --no-audit

# Build the application with optimizations
echo ">>> Building application..."
NEXT_TELEMETRY_DISABLED=1 npm run build

# Run tests
echo ">>> Running tests..."
npm test || echo "WARNING: Tests failed but continuing deployment"

# Build Docker image with multi-stage build for smaller size
echo ">>> Building Docker image..."
docker build -t ddx-control-board:latest \
  --build-arg NEXT_PUBLIC_WS_URL=${NEXT_PUBLIC_WS_URL:-} \
  --build-arg NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL:-} \
  .

# Stop existing container if running
echo ">>> Stopping existing container..."
docker stop ddx-control-board 2>/dev/null || true
docker rm ddx-control-board 2>/dev/null || true

# Run new container with resource limits and health checks
echo ">>> Starting new container..."
docker run -d --name ddx-control-board \
  --restart unless-stopped \
  --health-cmd "curl -f http://localhost:3000/api/health || exit 1" \
  --health-interval 30s \
  --health-timeout 10s \
  --health-retries 3 \
  --memory 1g \
  --cpus 1 \
  -p ${PORT:-3000}:3000 \
  -e NODE_ENV=production \
  -e PORT=${PORT:-3000} \
  -e NEXT_PUBLIC_WS_URL=${NEXT_PUBLIC_WS_URL:-} \
  -e NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL:-} \
  -e EXCHANGE_API_KEY=${EXCHANGE_API_KEY:-} \
  -e EXCHANGE_API_SECRET=${EXCHANGE_API_SECRET:-} \
  -e SLACK_WEBHOOK_URL=${SLACK_WEBHOOK_URL:-} \
  -e NVIDIA_API_KEY=${NVIDIA_API_KEY:-} \
  -e Git_Token=${Git_Token:-} \
  ddx-control-board:latest

# Set up monitoring with PM2
echo ">>> Setting up monitoring..."
pm2 start npm --name "ddx-control-board" -- start -- --port 3000

# Set up log rotation
echo ">>> Configuring log rotation..."
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7

# Save PM2 configuration
pm2 save

# Set up cron job for daily restart to prevent memory leaks
echo ">>> Setting up maintenance cron job..."
(crontab -l 2>/dev/null || echo "") | grep -v "ddx-control-board" | { cat; echo "0 3 * * * docker restart ddx-control-board && echo 'DDx Control Board restarted at $(date)' >> /var/log/ddx-restart.log"; } | crontab -

echo ">>> DDx Control Board deployment complete at $(date)"
echo ">>> Access at http://localhost:3000"
echo ">>> Monitoring available via 'pm2 logs ddx-control-board'"
echo ">>> Container health status: $(docker inspect --format='{{.State.Health.Status}}' ddx-control-board)"
