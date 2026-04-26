# NERV-VIPER Full-Stack Deployment Guide

This document outlines the steps to deploy the NERV-VIPER SaaS application with a Next.js frontend on Vercel and a Node.js/Express backend on Render.

## 1. Backend Deployment (Render)

### Configuration
1. Create a new **Web Service** on [Render](https://render.com).
2. Connect your GitHub repository.
3. Set the following configurations:
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: `backend`
4. Add the following **Environment Variables**:
   - `SUPABASE_URL`: Your Supabase Project URL.
   - `SUPABASE_ANON_KEY`: Your Supabase Anon Key.
   - `FRONTEND_URL`: `https://your-vercel-app.vercel.app`
   - `PORT`: `5000` (Render will override this, but good to have).

### Protected Routes
The backend uses a Supabase JWT middleware (`backend/src/middleware/auth.js`) to verify requests. Ensure the `Authorization` header is sent as `Bearer <token>`.

---

## 2. Frontend Deployment (Vercel)

### Configuration
1. Create a new project on [Vercel](https://vercel.com).
2. Connect your GitHub repository.
3. Set the **Root Directory** to `nerv-web`.
4. Add the following **Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL.
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Anon Key.
   - `NEXT_PUBLIC_BACKEND_URL`: `https://your-render-backend.onrender.com`
   - `NEXT_PUBLIC_SITE_URL`: `https://your-vercel-app.vercel.app`

### Auth Callback
Ensure you have added `https://your-vercel-app.vercel.app/auth/callback` to your **Supabase Redirect URLs**.

---

## 3. Supabase Setup

1. **Authentication**: Enable Google OAuth in the Supabase Dashboard.
2. **Redirect URLs**: Add both your local and production URLs:
   - `http://localhost:3000/auth/callback`
   - `https://your-vercel-app.vercel.app/auth/callback`
3. **Database**: Ensure your `profiles` and `subscriptions` tables are set up to store user metadata and plan information.

---

## Architecture Summary

- **Frontend**: Next.js (App Router)
  - Handles UI, Auth state, and routing.
  - Sends Supabase JWT to backend for data operations.
- **Backend**: Node.js + Express
  - Stateless API.
  - Verifies JWTs using Supabase Admin/Anon keys.
  - Processes security scans and orchestrates VIPER nodes.
- **Auth**: Supabase Auth (OIDC / OAuth)
  - Single Source of Truth for identity.
