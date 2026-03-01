# Riverlands

Tourism, history, and community website for seven Illinois counties along the Illinois/Mississippi River corridor: Adams, Pike, Brown, Schuyler, Calhoun, Scott, and Morgan.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Database:** Supabase (PostgreSQL + Auth + RLS)
- **Styling:** Tailwind CSS 4 + shadcn/ui
- **Rich Text:** Tiptap
- **Maps:** Leaflet + React Leaflet
- **Email:** Resend
- **Images:** Cloudinary
- **Analytics:** Vercel Analytics + Speed Insights
- **Package Manager:** pnpm

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 10+
- A Supabase project (for database and auth)

### Environment Setup

Copy the example env file and fill in the values:

```bash
cp env.local.example .env.local
```

Required variables:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-only) |
| `RESEND_API_KEY` | Resend API key for emails |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `NEXT_PUBLIC_SITE_URL` | Public site URL (also used for admin panel) |

### Development

```bash
pnpm install
pnpm dev
```

The dev server starts at [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/
  (public)/        # Visitor-facing pages (homepage, counties, events, etc.)
  admin/           # Admin panel (content management, dashboard)
  layout.tsx       # Root layout with fonts, theme, analytics
  sitemap.ts       # Dynamic sitemap generation
  robots.ts        # Robots.txt directives
components/
  ui/              # shadcn/ui primitives
  admin/           # Admin panel components
  sections/        # Homepage sections
  ads/             # Advertising components
lib/
  counties.ts      # County data and lookup
  supabase/        # Supabase client utilities
  placeholder-data.ts  # Mock data for development
supabase/
  schema.sql       # Database schema
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |

## Deployment

Deploy to Vercel:

1. Connect your GitHub repository to Vercel
2. Set all environment variables in the Vercel dashboard
3. Deploy

The admin panel is accessible at `/admin` on the same domain — no separate subdomain or DNS configuration needed.

## License

[MIT](LICENSE)
