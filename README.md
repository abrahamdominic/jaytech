# J Tech Solar, Starlink & CCTV Hub

Professional solar installation, Starlink setup, electrical solutions, and reliable energy services delivered nationwide across Nigeria.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Payments**: Paystack
- **Email**: Resend
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Image Processing**: Sharp

## Features

### Public Website
- Responsive homepage with hero carousel, stats, featured services, and testimonials
- Service listing and detail pages with FAQs, benefits, equipment, and process steps
- Project portfolio with image galleries and before/after showcases
- Blog with categories, tags, SEO metadata, and rich content
- Customer reviews and testimonials
- FAQ section with searchable categories
- Contact form with service type selection
- WhatsApp integration for instant communication
- SEO-optimized pages with meta titles, descriptions, and structured data

### Admin Dashboard
- Overview dashboard with key metrics and recent activity
- Booking management (create, update, assign technicians, track status)
- Quote management with line items, PDF generation, and approval workflow
- Invoice generation and payment tracking
- Service and service category CRUD management
- Project portfolio management with image uploads
- Blog post editor with rich content and category management
- Review moderation (approve, feature, delete)
- FAQ management
- Contact message management with read/reply status
- Technician profiles and availability tracking
- Site settings management (business info, social links, hero content, SEO)
- Notification system for admin events

### Booking System
- Multi-step booking form with service selection and project details
- Automated booking number generation
- Technician assignment and scheduling
- Status tracking (pending, confirmed, assigned, in_progress, completed, cancelled)
- File uploads for project references

### Quote System
- Quote request form with service details and budget
- Quote generation with line items and tax calculation
- Quote status workflow (pending, reviewing, quoted, accepted, rejected)
- Expiry management

### Payment Integration
- Paystack payment processing
- Deposit and balance payment support
- Transaction tracking and reference management
- Payment status synchronization

### Technical Features
- Server-side rendering with Next.js App Router
- Supabase Row Level Security (RLS) for data protection
- Type-safe database queries
- Responsive design across all devices
- Image optimization with Sharp
- Form validation with Zod schemas
- Error handling and toast notifications

## Setup Instructions

### Prerequisites

- Node.js 18+ (recommended: 20+)
- npm, yarn, or pnpm
- A Supabase project (free tier works)
- A Paystack account (test mode for development)
- A Resend account (for email)

### 1. Clone and Install

```bash
git clone <repository-url>
cd J Tech Solar, Starlink & CCTV Hub
npm install
```

### 2. Environment Variables

Copy the example env file and fill in your values:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your credentials:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Paystack
PAYSTACK_SECRET_KEY=your_paystack_secret_key
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your_paystack_public_key

# Resend (Email)
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=noreply@J Tech Solar, Starlink & CCTV Hub.ng

# WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER=2348000000000

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=J Tech Solar, Starlink & CCTV Hub
```

### 3. Database Setup

In your Supabase project dashboard:

1. Go to **SQL Editor**
2. Run the schema file first:
   - Paste the contents of `supabase/schema.sql` and execute
3. Run the seed file next:
   - Paste the contents of `supabase/seed.sql` and execute
4. Verify tables are created by checking the **Table Editor**

### 4. Image Setup

Add the required images to `public/images/`. See `public/images/README.md` for the complete list of required images with naming conventions and recommended dimensions.

At minimum, you need:
- `jay.png` - Company logo
- `jay1.jpg` through `jay3.jpg` - Hero backgrounds
- `jay4.jpg` through `jay9.jpg` - Service card images

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
J Tech Solar, Starlink & CCTV Hub/
├── public/
│   └── images/           # Static image assets
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── (public)/     # Public-facing routes
│   │   ├── admin/        # Admin dashboard routes
│   │   ├── api/          # API routes
│   │   └── layout.tsx    # Root layout
│   ├── components/       # React components
│   │   ├── ui/           # Reusable UI components
│   │   ├── admin/        # Admin dashboard components
│   │   └── public/       # Public website components
│   ├── lib/              # Utilities and configurations
│   │   ├── supabase/     # Supabase client setup
│   │   └── utils/        # Helper functions
│   ├── types/            # TypeScript type definitions
│   └── middleware.ts     # Next.js middleware (auth, redirects)
├── supabase/
│   ├── schema.sql        # Database schema
│   └── seed.sql          # Demo seed data
├── .env.local.example    # Environment variable template
├── next.config.ts        # Next.js configuration
├── postcss.config.mjs    # PostCSS configuration
├── tailwind.config.*     # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
```

## Admin Access

The admin dashboard is accessible at `/admin`. To create an admin user:

1. Sign up for an account through the application (or use Supabase dashboard to create a user)
2. In the Supabase Table Editor, find the user in the `profiles` table
3. Change the `role` field from `customer` to `admin` or `super_admin`

Admin roles:
- **admin**: Full access to the dashboard, can manage all content
- **super_admin**: Same as admin plus ability to manage settings and other admin users

## Deployment (Vercel)

### Deploy to Vercel

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

2. Import the project in [Vercel](https://vercel.com/new):
   - Select your repository
   - Vercel will auto-detect Next.js and configure the build

3. Add environment variables in the Vercel dashboard:
   - Add all variables from your `.env.local`
   - Update `NEXT_PUBLIC_APP_URL` to your production domain

4. Deploy:
   - Vercel will build and deploy automatically
   - Every push to the main branch triggers a new deployment

### Post-Deployment

1. Set up your custom domain in Vercel dashboard
2. Update `NEXT_PUBLIC_APP_URL` to `https://your-domain.com`
3. Ensure your Supabase project is on a plan that supports your expected traffic
4. Configure Paystack webhook URL to point to your production domain
5. Set up Resend domain verification for your email domain

### Performance Notes

- Next.js 16 with App Router provides automatic code splitting and streaming
- Images should be optimized - use Next.js `<Image>` component where possible
- Supabase queries are server-side by default in Server Components
- Consider enabling Vercel Analytics and Speed Insights

## License

This project is proprietary software owned by J Tech Solar, Starlink & CCTV Hub. All rights reserved.
