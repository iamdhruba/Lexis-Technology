# EduJung Co. Ltd. Website

A full-stack website clone for EduJung Co. Ltd. built with:

- **Frontend:** React + TypeScript + Vite + Tailwind CSS
- **Backend:** Node.js + Express + TypeScript
- **Database:** MongoDB + Mongoose
- **Email:** Resend
- **Image Storage:** Cloudinary (optional) / local uploads

## Folder Structure

```
EDUJUNG WEBSITE/
├── client/          # React public site & admin dashboard
├── server/          # Express API
├── logo.png         # Company logo
└── README.md
```

## Quick Start

### 1. Install dependencies

```bash
npm install
```

> **Windows/OneDrive users:** If root install fails with `EPERM` because a file is locked, run `npm install --ignore-scripts` at the root to install the `concurrently` helper (server and client dependencies must already be installed), then seed and run as shown below.

If you still need to install server/client dependencies manually:

```bash
npm install --prefix server
npm install --prefix client
```

### 2. Configure environment

Copy `server/.env.example` to `server/.env` and fill in your values.
`MONGODB_URI` and `JWT_SECRET` are required in production. Use
`MONGODB_DB` to select the database (defaults to `edujung`).

### 3. Seed the database (one-time)

```bash
npm run seed --prefix server
```

Development admin: `admin@edujung.com` / `Admin1234`. Set a unique
`ADMIN_EMAIL` and a strong `ADMIN_PASSWORD` before deploying.

### 4. Run development servers

You can start both the API and the client with a single command from the project root:

```bash
npm run dev
```

Or start them separately:

```bash
# Terminal 1 - API (http://localhost:5000)
npm run dev --prefix server

# Terminal 2 - Client (http://localhost:5173)
npm run dev --prefix client
```

Open http://localhost:5173 to view the site.
Open http://localhost:5173/admin to access the admin dashboard.

> **Note:** If you see "Failed to load page", make sure MongoDB is running and the server is started as shown above.

## Vercel + Render Deployment

The repository includes:

- `vercel.json` for the Vite frontend and SPA deep-link routing.
- `render.yaml` for the Express API, database seeding, and health checks.

### 1. Deploy the API on Render

In Render, create a **Blueprint** from this GitHub repository. Render detects
`render.yaml` and creates the `edujung-api` web service.

Enter these values when Render asks for environment variables:

```dotenv
MONGODB_URI=mongodb+srv://USER:PASSWORD@HOST/?retryWrites=true&w=majority
CORS_ORIGIN=https://your-vercel-project.vercel.app
FRONTEND_URL=https://your-vercel-project.vercel.app
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=use-a-unique-password-with-at-least-12-characters
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
RESEND_API_KEY=your-resend-key
RESEND_FROM_EMAIL=noreply@your-verified-domain.com
RESEND_TO_EMAIL=info@example.com
```

`JWT_SECRET` is generated securely by Render. The start command seeds a new
database idempotently before starting the API. Render supplies `PORT`
automatically.

After deployment, confirm that this URL returns JSON:

```text
https://your-render-service.onrender.com/api/health
```

### 2. Deploy the frontend on Vercel

Import the same GitHub repository into Vercel and keep the project root as the
repository root. `vercel.json` supplies the install command, build command,
output folder, and SPA rewrite.

Add this Vercel environment variable for Production, Preview, and Development:

```dotenv
VITE_API_BASE=https://your-render-service.onrender.com/api
```

Deploy the Vercel project. If its final public URL differs from the value entered
for `CORS_ORIGIN`, update `CORS_ORIGIN` in Render and redeploy the API. Multiple
exact frontend URLs can be comma-separated.

### 3. Production checks

- Open the Vercel homepage and a direct route such as `/about`.
- Log in at `/admin/login`.
- Save a page edit and upload an image.
- Submit the contact form and verify the configured inbox.

Cloudinary is required for durable image uploads on Render because its local
filesystem is not persistent. Never commit `server/.env`.

## Admin Dashboard

Login at `/login`. From the dashboard you can edit every page and all content
sections, review registered users, and manage roles. New signups receive the
`user` role and cannot access administration features. Images can be uploaded to
Cloudinary when credentials are provided; otherwise they are stored locally in
the `uploads` folder.
