# AI Agent Instructions

This file defines how AI agents should behave in this repository.

---

## 🎯 Project Goal

This project is a full-stack, multilingual portfolio website and headless CMS built with Next.js 16, React 19, TypeScript, Tailwind CSS v4, Supabase, and Motion (formerly Framer Motion).

The AI agent should help with:

- Writing clean, maintainable, and type-safe code
- Fixing bugs with minimal changes
- Improving performance
- Explaining code when asked
- Following the existing project structure and conventions

---

## 📁 Repository Rules

- **Never delete files unless explicitly asked.**
- **Never refactor large parts of the project without confirmation.**
- **Always check existing code before writing new code.**
- **Prefer modifying existing code over creating new files.**
- Keep commits small and meaningful when using Git.
- Do not push directly without explicit confirmation.

---

## 💻 Tech Stack

| Layer | Technology | Version |
| ----- | ---------- | ------- |
| Framework | [Next.js](https://nextjs.org/) (App Router) | 16.2.9 |
| UI Library | [React](https://react.dev/) | 19.2.7 |
| Language | [TypeScript](https://www.typescriptlang.org/) | 5.x |
| Styling | [Tailwind CSS](https://tailwindcss.com/) | 4.x |
| Animations | [Motion](https://motion.dev/) | 12.x |
| Database & Auth | [Supabase](https://supabase.com/) (`@supabase/supabase-js` + `@supabase/ssr`) | 2.x / 0.12 |
| Validation | [Zod](https://zod.dev/) | 3.x |
| Notifications | [Sonner](https://sonner.emilkowal.ski/) | 2.x |
| Icons | [Lucide React](https://lucide.dev/) | 0.575.0 |
| Markdown | `react-markdown` + `rehype-sanitize` | 10.x / 6.x |

---

## 🏗️ Project Architecture

```text
.
├── supabase_schema.sql          # Full database schema with RLS policies
├── .env.example                 # Environment variable template
├── next.config.ts               # Next.js config + CSP/security headers
├── middleware.ts                # Auth middleware for /admin routes
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── page.tsx             # Homepage (server component)
│   │   ├── admin/               # Admin dashboard + login
│   │   ├── blog/                # Public blog feed
│   │   ├── works/               # Public portfolio works feed
│   │   ├── certifications/      # Dedicated certification detail page
│   │   ├── credits/             # Tech credits page
│   │   ├── api/github/          # GitHub GraphQL contribution API
│   │   └── feed.xml/            # RSS feed generator
│   ├── components/
│   │   ├── admin/               # Admin UI components
│   │   ├── home/                # Public homepage sections
│   │   ├── motion/              # Reusable animation wrappers
│   │   ├── navigation/          # Dock navigation
│   │   └── theme-provider.tsx   # next-themes wrapper
│   ├── config/
│   │   ├── locales/             # Static UI translations
│   │   ├── translations.ts      # Typed i18n dictionary
│   │   └── user.ts              # Hardcoded user fallbacks
│   ├── context/
│   │   ├── language-context.tsx # Global language provider
│   │   └── site-data-context.tsx # Supabase data cache
│   ├── lib/
│   │   ├── supabase.ts          # Supabase client singletons
│   │   ├── data.ts              # Server data fetching helpers
│   │   └── utils.ts             # cn(), sanitizeUrl(), validators
│   └── types/
│       └── index.ts             # Centralized TypeScript interfaces
```

---

## 💡 Coding Style

- Use **clean and readable TypeScript**; avoid `any`.
- Prefer **functional components** and React Hooks.
- Keep functions **small, focused, and reusable**.
- Use the existing utility helpers:
  - `cn(...)` from `@/lib/utils` for class merging.
  - `sanitizeUrl()` for any user-provided URLs (XSS prevention).
  - `isValidEmail()` and `isValidImageUrl()` where appropriate.
- Use `@/` path aliases for imports from `src/`.
- Follow the existing naming convention:
  - Components: PascalCase (`info.tsx` exports `Info`)
  - Utilities/Hooks: camelCase
  - Types/Interfaces: PascalCase in `src/types/index.ts`
- All user-generated URLs **must** be sanitized before rendering.
- Avoid unnecessary complexity; prefer minimal, safe changes.

---

## 🌍 Multilingual System (i18n)

- The site supports **EN, TR, DE, ES**.
- Static UI strings live in `src/config/translations.ts`.
- Content translations are stored per-row in Supabase (e.g. `title_tr`, `bio_de`).
- Use `getLocalized(value, lang)` from `@/lib/data` for content fields.
- Default language is `"en"`.

---

## ⚙️ Workflow Rules

When given a task:

1. **Read relevant files first** using the filesystem tools.
2. **Understand the existing architecture** before making changes.
3. **Plan changes before writing code.**
4. **Apply minimal, safe changes.**
5. **Explain what was changed** when done.
6. **Validate mentally** before marking complete. Run `npm run lint` or `npm run build` when appropriate.

---

## 🔒 Security & Database Integrity Rules

This project has a multi-layered security model. Do not weaken it.

- **Never** expose Supabase service-role keys or secrets in code.
- **Always** sanitize user-provided URLs with `sanitizeUrl()` before rendering.
- **Always** sanitize markdown content via `rehype-sanitize`.
- Admin routes (`/admin/*` except `/admin/login`) are protected by `middleware.ts` using HTTP-only secure cookies.
- CSP headers are generated dynamically in `next.config.ts` from `NEXT_PUBLIC_SUPABASE_URL`.
- Do not remove or disable RLS-related logic in `supabase_schema.sql`.
- Do not introduce new external scripts without updating CSP headers.
- 🗄️ **Database Schema Synchronization:** Any change, addition, or modification affecting the database structure, tables, functions, triggers, or Row Level Security (RLS) policies **must be documented in detail and explicitly updated within `supabase_schema.sql`**. Never apply database patches or direct production hotfixes without keeping the repository's schema file 100% in sync.

---

## 🧪 Testing & Local Verification Rules

- Test changes mentally before finalizing.
- Prefer automated checks when possible:
  - `npm run lint` for linting
  - `npm run build` for build verification
  - `npm run dev` for local manual testing
- Do not mark tasks as complete without validation.
- 🎭 **Local Playwright Execution:** When developing, testing, or debugging UI workflows locally, always run Playwright against the local dev server to execute End-to-End (E2E) verification. Ensure the local dev server is active and the feature is verified in headless or UI mode before concluding it works.

---

## 🚫 Forbidden Actions

- Do not overwrite configuration files (`next.config.ts`, `middleware.ts`, `tsconfig.json`, etc.) unless asked.
- Do not remove dependencies without explanation.
- Do not introduce new libraries without justification.
- Do not delete files unless explicitly asked.
- Do not refactor large parts of the codebase without confirmation.

---

## 🧩 Notes

- This project is AI-assisted and behaves like a senior software engineer.
- All content is admin-editable from `/admin`; public pages read from Supabase.
- Use Context7 MCP for up-to-date documentation on Next.js, React, Supabase, Tailwind, Motion, Zod, or other libraries when needed.
- For every database schema change, prefer updating `supabase_schema.sql` and documenting the migration steps.
- The repository has been renamed to `batuhdede.me`; the canonical GitHub URL is `https://github.com/batuhd/batuhdede.me`.
