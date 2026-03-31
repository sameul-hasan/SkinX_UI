# SkinX

SkinX is a mobile-first skin awareness web application with guided scan intake, structured session history, and admin-level monitoring insights.

## Tech Stack

- React + Vite
- Tailwind CSS
- Framer Motion
- lucide-react
- LocalStorage for client-side persistence

## Application Routes

- `/` — Landing page
- `/about` — Product and clinical roadmap overview
- `/awareness` — Public awareness experience (BoSkin)
- `/login` — User login
- `/signup` — Account creation
- `/app` — Authenticated dashboard

## Key Functional Modules

### 1. Session Workspace

- Create a structured skin session with required intake data
- Chat-first workflow with quick actions
- Session timeline including scans, comparisons, and summary messages

### 2. Scan Flow

- Required 3-image upload/capture flow: close shot, 45° angle, wide angle
- Per-image editor supports:
  - zoom in/out
  - rotation
  - directional positioning (left/right/up/down with press-and-hold)
- Center square guide is shown on each preview
- On save, only the square-marked image area is persisted

### 3. Awareness Experience

- Public BoSkin assistant available without login
- Awareness cards and safety disclaimer content

### 4. Admin Tools

- Embedded admin dashboard inside authenticated app
- Snapshot analytics for users, sessions, scans, and trends
- Export options for all datasets (all/users/sessions/scans/messages/stats)

## Authentication (Mock)

Default admin credentials:

- Email: `admin@skinx.com`
- Password:

## Local Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
```

## Deployment

Vercel configuration is included via `vercel.json` (SPA rewrites + production headers).

Recommended Vercel settings:

- Framework: `Vite`
- Build command: `npm run build`
- Output directory: `dist`

## Reliability Notes

- Required fields are validated in intake and scan forms
- Scan previews enforce bounded image movement and clipping
- Data ownership behavior is role-aware (user-only vs admin-all visibility)

## Disclaimer

SkinX provides awareness support and workflow assistance. It does not provide a medical diagnosis.
