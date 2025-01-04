#!/bin/bash
ssh 45.61.137.230 "cd ~/backend && pnpm prisma db push && pnpm prisma generate"
