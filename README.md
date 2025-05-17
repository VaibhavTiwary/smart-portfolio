# Smart Shareable Portfolio – ValueMetrix

A Next.js application that allows users to create, share, and analyze investment portfolios. Users can generate smart shareable links to share their portfolios with anyone. AI-powered insights provide portfolio summaries, sector exposure, and investment theses using OpenAI's API.

---

## Project Structure

```
.
├── eslint.config.mjs                   # ESLint configuration
├── LICENSE                             # License info
├── next.config.ts                      # Next.js config
├── next-env.d.ts                       # TypeScript environment declarations
├── package.json                        # NPM package dependencies
├── package-lock.json                   # Dependency lockfile
├── postcss.config.mjs                  # PostCSS configuration
├── prisma/
│   └── schema.prisma                   # Prisma schema defining DB models
├── public/
│   ├── *.svg                           # Static assets like logos/icons
├── README.md                           # Project documentation (this file)
├── src/
│   ├── app/
│   │   ├── api/                        # API routes
│   │   │   ├── auth/                   # NextAuth authentication endpoints
│   │   │   ├── portfolio/              # CRUD endpoints for portfolios
│   │   │   └── track-access/           # Logs shared link accesses
│   │   ├── dashboard/                  # Authenticated user dashboard
│   │   ├── favicon.ico                 # App favicon
│   │   ├── globals.css                 # Global Tailwind CSS styles
│   │   ├── layout.tsx                  # Shared app layout
│   │   ├── login/                      # Login screen using NextAuth
│   │   ├── page.tsx                    # Landing page ("/")
│   │   └── portfolio/
│   │       ├── new/                    # Create portfolio UI
│   │       └── shared/                 # Public/shared portfolio viewer
│   ├── generated/                      # Auto-generated types and client
│   └── lib/
│       ├── auth.ts                     # Helper for getting current session
│       ├── components/                 # Reusable UI components
│       │   ├── GenerateInsightsBtn.tsx # AI insight trigger button
│       │   ├── ShareBtn.tsx            # Button to create shareable links
│       │   ├── SharedLinks.tsx         # Shows all active share links
│       │   └── TokenTracker.tsx        # Shows viewer count per link
│       ├── logAccess.ts                # Tracks anonymous accesses
│       └── prisma.ts                   # Prisma client setup
└── tsconfig.json                       # TypeScript compiler options
```
---

## How to Run Locally

### 1. Clone the repository

```bash
git clone git@github.com:VaibhavTiwary/smart-portfolio.git
cd smart-portfolio
npm i
```

### 2. Configure environment vars

Create a `.env` file:

```bash
DATABASE_URL="mongodb+srv://<your-cluster>.mongodb.net/dbname"
GITHUB_ID="<your-github-client-id>"
GITHUB_SECRET="<your-github-client-secret>"
NEXTAUTH_SECRET="<random-secret>"
OPENAI_API_KEY="<your-openai-api-key>"
```

### 3. Start dev server

```bash
npm run dev
```

Visit `localhost:3000`.

## Prompt Design Explanation

AI insights are generated using the OpenAI API. A prompt is crafted to instruct the assistant to:

- Analyze portfolio diversification and sector exposure.
- Highlight major holdings and cash position.
- Generate a concise investment thesis.

The detailed prompt can be seen in [./src/app/api/portfolio/generate-insights/\[id\]/route.ts](./src/app/api/portfolio/generate-insights/[id]/route.ts).

## Limitations

- AI-generated insights may be superficial without access to real-time price or fundamentals.
- IP + User-Agent based viewer tracking is limited; no fingerprinting or identity resolution.
- Shared links do not currently expire — they must be manually revoked.
- No role-based access or permissions (e.g., read-only, comment).
- Insights generation is not cached or debounced, which may lead to unnecessary API calls.

# What You’d Build Next

1. Browser Fingerprinting for Smarter Insights
To improve viewer tracking for shared links, I would implement lightweight browser fingerprinting to distinguish unique visitors more accurately beyond just IP and User-Agent.

2. Expiry Support for Shared Links
Support automatic expiration of shared links via an optional `expiresAt` field in the `SharedPortfolioAccess` model. Expired links would return a 410 Gone error and be excluded from dashboards.