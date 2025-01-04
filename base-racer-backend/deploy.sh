#!/bin/bash
pnpm build
scp out/index.js 45.61.137.28:~/backend/index.js && scp prisma/schema.prisma 45.61.137.28:~/backend/prisma/schema.prisma && scp package.json 45.61.137.28:~/backend/package.json && scp docker-compose.yml 45.61.137.28:~/backend/docker-compose.yml && scp .env.prod 45.61.137.28:~/backend/.env
# ssh 45.61.137.28
# pnpm prisma db push
# pm2 restart index
