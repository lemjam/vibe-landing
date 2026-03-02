#!/usr/bin/env bash
set -e

echo "=== 1. Landing view event ==="
curl -s -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{"type":"landing_view"}'
echo -e "\n"

echo "=== 2. CTA click event ==="
curl -s -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{"type":"cta_click"}'
echo -e "\n"

echo "=== 3. Create lead ==="
curl -s -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","contact":"test@example.com","consent":true}'
echo -e "\n"

echo "=== 4. Webhook (new) ==="
curl -s -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -H "x-webhook-secret: my-secret-123" \
  -d '{"id":"evt-001","event":"test","data":{"foo":"bar"}}'
echo -e "\n"

echo "=== 5. Webhook (duplicate) ==="
curl -s -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -H "x-webhook-secret: my-secret-123" \
  -d '{"id":"evt-001","event":"test","data":{"foo":"bar"}}'
echo -e "\n"

echo "=== 6. Webhook (wrong secret) ==="
curl -s -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -H "x-webhook-secret: wrong-secret" \
  -d '{"id":"evt-002","event":"test","data":{}}'
echo -e "\n"
