# Vibe Landing Starter

## Стек
Next.js 14, TypeScript, Tailwind CSS, Prisma 5, PostgreSQL

## Запуск локально
1. `git clone` / unzip
2. `cp .env.example .env` (заполнить значения)
3. `npm install`
4. `npx prisma migrate dev`
5. `npm run dev` → http://localhost:3000

## Переменные окружения
- **DATABASE_URL** — строка подключения к PostgreSQL
- **TELEGRAM_BOT_TOKEN** — токен бота из @BotFather
- **TELEGRAM_CHAT_ID** — ID чата для уведомлений
- **WEBHOOK_SECRET** — секрет для входящих вебхуков

## Демо-скрипт (проверка за 2 минуты)

Убедитесь, что приложение запущено (`npm run dev`). Выполните:

```bash
bash scripts/demo.sh
```

Содержимое `scripts/demo.sh`:

```bash
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
```

Ожидаемый результат:
- Шаги 1–3: ответы `201` с данными события/лида
- Шаг 4: `201` с `{"status":"created","id":"evt-001"}`
- Шаг 5: `200` с `{"status":"duplicate","id":"evt-001"}`
- Шаг 6: `401` с `{"error":"Unauthorized"}`

# vibe-landing
