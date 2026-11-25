# Portfolio

Personal portfolio built with **Next.js 16**, **React 19**, **Tailwind CSS**, **Framer Motion** and **Prisma 7** (PostgreSQL). It keeps a view and like counter in the database.

## Run locally

```bash
npm install
cp .env.example .env      # put your PostgreSQL connection string here
npx prisma generate
npx prisma db push
npm run dev
```
