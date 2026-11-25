# Портфолио

[English](README.md) · **Русский**

Личное портфолио на **Next.js 16**, **React 19**, **Tailwind CSS**, **Framer Motion** и **Prisma 7** (PostgreSQL).
Считает просмотры и лайки в базе данных.

## Запуск на своём компьютере

```bash
npm install
cp .env.example .env      # впишите строку подключения к PostgreSQL
npx prisma generate
npx prisma db push
npm run dev
```
