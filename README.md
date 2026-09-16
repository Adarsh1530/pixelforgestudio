# PixelForge Studio — Web Application & Admin CMS

A production-quality digital software studio website and secure dynamic Admin Dashboard built for **PixelForge Studio**.

Tagline: *"Your Ideas. Our Code. Real Solutions."*  
Descriptor: *DESIGN • DEVELOPMENT • BRANDING • SOLUTIONS*

---

## Technical Stack

- **Framework**: Next.js 15 (App Router, Server & Client Components)
- **Styling**: Tailwind CSS with strict palette design system
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Database & ORM**: Prisma ORM with SQLite (Development) / PostgreSQL-ready
- **Authentication**: HTTP-only JWT cookies (`jose`) + `bcryptjs` password hashing
- **Validation**: Zod schema validation
- **File Storage**: Local uploads (`/public/uploads/`) with S3 / Supabase storage abstraction

---

## Strict Color Palette

- **Primary Dark**: `#1C2833` (`--pf-primary`)
- **Secondary Dark**: `#2E4053` (`--pf-secondary`)
- **Muted Gray**: `#AAB7B8` (`--pf-muted`)
- **Light Gray**: `#D5DBDB` (`--pf-light`)
- **Off-White**: `#F4F6F6` (`--pf-bg`)

---

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Copy `.env.example` to `.env`:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="pixelforge_super_secret_jwt_key_2026_change_in_production"
ADMIN_EMAIL="admin@pixelforge.studio"
ADMIN_PASSWORD="PixelForge2026!"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### 3. Initialize & Seed Database

Run Prisma database setup and initial data seed:

```bash
npx prisma db push
npx tsx prisma/seed.ts
```

This populates default site settings, 6 core services, 4 academic packages (BCA & MCA), and the initial admin user.

### 4. Start Development Server

```bash
npm run dev
```

Visit the public website at: `http://localhost:3000`  
Visit the Admin Portal at: `http://localhost:3000/admin`

---

## Admin Portal & Credentials

- **URL**: `/admin/login`
- **Default Email**: `admin@pixelforge.studio`
- **Default Password**: `PixelForge2026!`

*(You can update the email, password, starting prices, services, packages, portfolio, and contact details inside `/admin` anytime).*

---

## Production Build & Verification

To test the production bundle:

```bash
npm run build
npm start
```

---

## Project Structure

```text
d:/PIXEL FORGE STUDIO/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Seed script
├── public/
│   ├── images/
│   │   └── logo.jpg       # Brand logo
│   └── uploads/           # Uploaded media
├── src/
│   ├── app/
│   │   ├── page.tsx       # Public One-Page Studio
│   │   ├── admin/         # Secure Admin Dashboard & CMS pages
│   │   └── api/           # Auth, Enquiries, CRUD & Upload endpoints
│   ├── components/
│   │   ├── public/        # Public section components
│   │   └── admin/         # Admin components & layout
│   ├── lib/
│   │   ├── prisma.ts      # Prisma Client instance
│   │   ├── auth.ts        # JWT & bcrypt auth utilities
│   │   ├── validation.ts  # Zod schemas
│   │   └── storage.ts     # Storage abstraction
│   └── middleware.ts      # Auth route protection
└── README.md
```
