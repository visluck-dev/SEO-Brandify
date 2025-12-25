# SEO Brandify

A static SEO and branding website built with React and Vite. All content is stored in client-side constants.

## Prerequisites

- Node.js 19+ (20+ recommended)
- npm or yarn

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the port Vite assigns)

### 3. Build for Production

```bash
npm run build
```

This will create a static site in the `dist/` directory that can be deployed to any static hosting service (Netlify, Vercel, GitHub Pages, etc.).

## Deployment

### GitHub Pages

See [DEPLOY.md](./DEPLOY.md) for detailed step-by-step instructions on deploying to GitHub Pages.

Quick steps:
1. Create a GitHub repository
2. Push your code
3. Enable GitHub Pages in repository settings (use GitHub Actions)
4. Your site will auto-deploy on every push to `main` branch

### 4. Preview Production Build

```bash
npm run preview
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build static site for production
- `npm run preview` - Preview production build locally
- `npm run check` - Type check the codebase

## Project Structure

- `client/` - React frontend application
- `client/src/constants/` - All website content and data
- `shared/` - Shared types and utilities
- `dist/` - Production build output (static files)

## Content Management

All website content is stored in the `client/src/constants/` directory:
- `content.ts` - Page content and metadata
- `services.ts` - Service listings
- `testimonials.ts` - Client testimonials
- `careers.ts` - Career listings
- `navigation.ts` - Navigation structure

Edit these files to update the website content.

