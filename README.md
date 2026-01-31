# 🚀 Premium Developer Portfolio 2026

Advanced Portfolio with Live Editing, 3D UI, and Multi-language support.

## 🌟 Key Features

- **Live Editing with OTP Security**: Securely edit your content directly on the site using one-time passwords.
- **Premium 3D UI**: Interactive 3D elements and smooth animations powered by Framer Motion and Three.js.
- **Multi-language Support (i18n)**: Fully localized content management with `next-intl`.
- **Modern Tech Stack**: Built with Next.js 15 (App Router), Supabase, shadcn/ui, and Tailwind CSS v4.
- **Glassmorphism Design**: Sleek, modern aesthetic with glass-like effects and vibrant gradients.

## 🛠 Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/), [Lucide React](https://lucide.dev/)
- **Backend/DB**: [Supabase](https://supabase.com/)
- **i18n**: [next-intl](https://next-intl-docs.vercel.app/)
- **Security**: [otplib](https://yeojansen.github.io/otplib/) for Admin OTP

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- A Supabase account and project

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd portfolio_2026
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file and add the following:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   OTP_SECRET=your-secret-key-for-otp
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## 🏗 Architecture

For detailed information about the system design, database schema, and data flow, please refer to [ARCHITECTURE.md](./ARCHITECTURE.md).

## 📄 License

MIT License. See [LICENSE](./LICENSE) for details.
