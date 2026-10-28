# Lexis Technology Website

A full-stack, enterprise-grade IT & Digital Media Agency website for **Lexis Technology** built with:

- **Frontend:** React + TypeScript + Vite + Tailwind CSS (Rectangular, high-contrast, modern tech blue design system)
- **Backend:** Node.js + Express + TypeScript
- **Database:** MongoDB + Mongoose
- **Email:** Resend
- **Image Storage:** Cloudinary (optional) / local uploads

---

## 🎨 Theme & Services Overview

### 1. Color Palette: Modern Tech Blue
- **Primary Brand Color:** Royal & Electric Blue (`#2563eb`, `#1d4ed8`)
- **Accent Glow:** Sky & Cyber Cyan (`#38bdf8`, `#0ea5e9`, `#60a5fa`)
- **Surfaces & Backgrounds:** Clean White (`#ffffff`), Ice Blue tints (`#eff6ff`), Slate (`#f8fafc`)
- **Dark Elements:** Deep Midnight Obsidian & Navy (`#0a0f1d`, `#070b16`)

### 2. Core IT & Creative Services
1. **Website Making & Web Development**
   - Custom responsive websites, SaaS platforms, React/Next.js web apps, e-commerce stores, speed and SEO optimization.
2. **Professional Video Editing**
   - High-retention viral Shorts/Reels/TikToks, YouTube long-form editing, commercials, 4K color grading & motion graphics.
3. **Photo Editing & Graphic Design**
   - E-commerce studio product retouching, brand identity packages, vector logo design, social media creative packs.
4. **Managed IT & Cloud Infrastructure**
   - High-speed cloud hosting setup, domain configuration, SSL security audits, website maintenance, 24/7 technical monitoring.

---

## 📁 Monorepo Structure

```text
Lexis Technology/
├── client/              # React public site & full Admin Dashboard
│   ├── src/
│   │   ├── components/  # Navbar, Footer, SectionRenderer, Sections
│   │   ├── context/     # Auth, Settings, Service contexts
│   │   ├── pages/       # Home, Service pages, Portfolio, Admin suite
│   │   └── types.ts     # TypeScript models
├── server/              # Express API & MongoDB backend
│   ├── src/
│   │   ├── models/      # Page, Settings, AdminUser, Contact
│   │   ├── routes/      # Auth, Pages, Settings, Uploads, Contact
│   │   └── seed.ts      # Database seeder for Lexis Technology
├── package.json         # Root monorepo scripts
└── README.md
```

---

## 🚀 Quick Start

### 1. Run Development Server
```bash
# Starts both frontend (http://localhost:5173) and backend (http://localhost:5000)
npm run dev
```

Or run client-only:
```bash
npm --prefix client run dev
```

### 2. Seed Database
Make sure MongoDB is running and configured in `server/.env`, then run:
```bash
npm run seed
```

### 3. Build for Production
```bash
npm run build
```

---

## 🛡️ Admin Dashboard
- Access at `/admin` (or `/login`).
- Superadmin management for all page sections, contact form submissions, site settings, and team members.
