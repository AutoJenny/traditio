# IMPORTANT: Always use port 3000 for dev server
- If port 3000 is blocked, stop the process using it and restart the dev server.
- Never use or spawn alternate ports (e.g., 3001) for development. This causes confusion and bugs.
- Always ensure http://localhost:3000 is the only active dev server.

# Traditio Project

**NOTE (2025-05-12): Prisma is no longer used.**
- All database access, migrations, and seeding are now handled via raw SQL and the `pg` package.
- The Prisma schema, client, and migration tools have been fully removed from the project.
- All future DB changes should be made by editing migration SQL files directly and updating scripts as needed.
- DB details are found in /Users/nickfiddes/Code/projects/traditio/.env or /Users/nickfiddes/Code/projects/traditio/.envrc

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Important: Use the Correct Directory

**Always run all development, build, and start commands from the project root directory. Do NOT cd into a subdirectory.**

If you run `npm run dev` from a subdirectory, the app will not work and you will get 404 errors. Always run commands from the root:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Important: Documentation

**Read the /docs directory fully before starting any new project or different task.**

**After completing a project or task update any /docs to maintain accuracy. Also add a note to the changes.log. Also commit to git**