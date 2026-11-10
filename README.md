# Apex Pulse — Formula 1 Telemetry & Analytics Platform

An unofficial, high-performance Formula 1 monthly-subscription web application built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, and **shadcn/ui**.

Data is fetched 100% browser-side directly from public community APIs (**Jolpica Ergast API** and **OpenF1 REST API**) with intelligent caching (**TanStack Query** + **localStorage**). User authentication and data isolation are managed client-side using **Firebase Auth** and **Firestore** protected by strict security rules. Monthly subscriptions and billing management are powered by **Dodo Payments** with a single server route handler (`/api/dodo/webhook`).

> **LEGAL DISCLAIMER**: This application is an unofficial product and is not affiliated, associated, authorized, endorsed by, or in any way officially connected with Formula 1, the FIA, Formula One Licensing B.V., or any of their subsidiaries or affiliates. F1, FORMULA ONE, FORMULA 1, FIA FORMULA ONE WORLD CHAMPIONSHIP, GRAND PRIX and related marks are trademarks of Formula One Licensing B.V.

---

## Architecture & Hard Constraints

- **Frontend Only**: Next.js 15 App Router with client-side React components.
- **Client Auth**: Firebase Authentication (Email/Password & Google One-Click) with client SDK.
- **User Document Protection**: Firestore security rules ensure users can read their own document but **cannot modify their own subscription fields** (`plan`, `status`, `subscriptionId`, etc.).
- **Payments**: Dodo Payments monthly subscription with hosted checkout and customer portal redirection passing `metadata_uid` and `email`.
- **Single Server Route**: Exactly **ONE** server route handler: `app/api/dodo/webhook/route.ts` which cryptographically verifies the Svix HMAC-SHA256 signature and syncs subscription status to Firestore using `firebase-admin`. No other backend, database server, or Python/Node servers exist.
- **Rate-Limit Resilience**: Client-side pacing queue (max 2 req/s) with `localStorage` fallback preventing OpenF1 30 req/min rate limit breaches.

---

## Features

### Free Paddock Tier
- **Season Calendar (`/races`)**: Full Grand Prix schedule, timetable, track coordinates, and race status.
- **Race Results (`/races/[round]`)**: Race classifications, qualifying results (Q1, Q2, Q3), and pit stop timestamps.
- **Championship Standings (`/standings`)**: Live Driver's and Constructor's World Championship points tables.
- **Driver Roster (`/drivers` & `/drivers/[id]`)**: Driver cards, biography links, career numbers, and season points.
- **Paddock Dashboard (`/dashboard`)**: Next race countdown, latest podium classification, and top championship contenders.

### Pro Tier ($9.99/mo, Powered by Dodo Payments)
- **Grand Prix Selector**: Switch dynamically between 8 iconic circuits (Sakhir, Suzuka, Monaco, Silverstone, Spa, Monza, Interlagos, Las Vegas), scaling track lengths, speed trap records, and overtaking indices.
- **Fastest Lap Telemetry Trace (`/pro/telemetry`)**: Synchronized car telemetry comparison (Speed, Throttle %, Brake pressure, Gear, and RPM) between any two drivers over a flying lap.
- **Lap-by-Lap Progression (`/pro/laps`)**: Complete race pace trajectories, pit stop in-lap/out-lap deltas, and standard deviation consistency.
- **Tyre Stints & Degradation Simulator (`/pro/strategy`)**: Fast-F1 derived compound degradation curves (Soft, Medium, Hard), performance cliff horizons, and 1-stop vs 2-stop strategy comparisons.
- **Interactive Session Replay Tower (`/pro/replay`)**: Interactive timing tower with play/pause, scrub slider, sector times, gaps to leader, and fastest lap highlights.
- **AI Outcome Predictor (`/pro/predictor`)**: Client-side statistical heuristics evaluating qualifying grid position, sector pace, and circuit overtaking indices to compute win and podium (Top-3) probabilities.
- **Customer Billing Portal (`/account`)**: Direct self-service portal via Dodo Payments for updating credit cards or cancelling subscriptions.

---

## Project Structure

```text
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx               # Firebase Email & Google Login
│   │   └── signup/page.tsx              # Firebase Registration
│   ├── (public)/
│   │   ├── page.tsx                     # Landing page with interactive preview
│   │   ├── pricing/page.tsx             # Pricing table with Dodo checkout flow
│   │   ├── races/page.tsx               # Season schedule & calendar
│   │   ├── races/[round]/page.tsx       # Race weekend results & qualifying
│   │   ├── drivers/page.tsx             # Driver grid roster
│   │   ├── drivers/[id]/page.tsx        # Driver telemetry profile
│   │   └── standings/page.tsx           # Driver & Constructor standings
│   ├── dashboard/page.tsx               # Free user dashboard overview
│   ├── account/page.tsx                 # Account profile & Dodo billing portal
│   ├── pro/                             # Pro-Gated Module
│   │   ├── layout.tsx                   # Pro subscription guard & Pro navigation
│   │   ├── page.tsx                     # Pro Engineering Hub
│   │   ├── telemetry/page.tsx           # Speed, Throttle, Brake comparison
│   │   ├── laps/page.tsx                # Lap time progression & degradation
│   │   ├── strategy/page.tsx            # Tyre compound stints & pit windows
│   │   ├── replay/page.tsx              # Session Replay & Near-Live timing
│   │   └── predictor/page.tsx           # Heuristic race & podium prediction
│   ├── api/dodo/webhook/route.ts        # THE ONLY SERVER ROUTE: Svix verify + firebase-admin
│   ├── globals.css
│   └── layout.tsx                       # Root layout with unofficial footer disclaimer
├── components/
│   ├── ui/                              # Button, Card, Badge, Tabs, Skeleton
│   ├── layout/                          # Navbar, Footer, ProBadge
│   ├── pro/                             # ProGate, TelemetryChart, StintVisualizer, ReplayTower, PredictorCard
│   ├── racing/                          # RaceCard, TyreBadge
│   └── providers.tsx                    # TanStack Query + Auth context providers
├── lib/
│   ├── api/
│   │   ├── jolpica.ts                   # Jolpica typed Ergast client & localStorage cache
│   │   ├── openf1.ts                    # OpenF1 throttled client
│   │   └── types.ts                     # TypeScript interfaces
│   ├── firebase/
│   │   ├── client.ts                    # Firebase Client SDK init
│   │   └── admin.ts                     # Firebase Admin SDK (Webhook only)
│   ├── dodo/
│   │   └── client.ts                    # Dodo checkout URL builder & customer portal links
│   ├── prediction/model.ts              # Client-side prediction heuristics
│   └── strategy/calculator.ts           # Tyre degradation curves & pit calculations
├── hooks/
│   ├── use-auth.tsx                     # Firebase auth state hook
│   ├── use-subscription.ts             # Real-time Firestore subscription hook
│   ├── use-jolpica.ts                  # React Query hooks for Jolpica
│   └── use-openf1.ts                   # React Query hooks for OpenF1
├── firestore.rules                      # Strict security rules protecting subscription fields
├── vendor/
│   └── LICENSES.md                      # Audit of all 11 study repos and extracted concepts
├── .env.example                         # Environment variables template
└── README.md
```

---

## Getting Started

### 1. Prerequisites
- **Node.js**: v18+ or v20+
- **npm** or **pnpm**
- **Firebase Project**: (Console -> Project Settings)
- **Dodo Payments Account**: (Test mode dashboard)

### 2. Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in your credentials:
```env
# Client Firebase SDK
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

# Server Firebase Admin SDK (Used ONLY in /api/dodo/webhook)
FIREBASE_ADMIN_PROJECT_ID=your-project
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEv...-----END PRIVATE KEY-----\n"

# Dodo Payments
NEXT_PUBLIC_DODO_ENV=test
NEXT_PUBLIC_DODO_BUSINESS_ID=bus_xxxxxxxxxx
NEXT_PUBLIC_DODO_PRODUCT_ID=pdt_xxxxxxxxxx
DODO_PRODUCT_ID=pdt_xxxxxxxxxx
DODO_PAYMENTS_API_KEY=dodo_test_xxxxxxxxxx
DODO_WEBHOOK_SECRET=whsec_xxxxxxxxxx
```

### 3. Install Dependencies & Run Locally
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Firebase Configuration & Security Rules

### Deploying Firestore Rules
In your Firebase project, deploy `firestore.rules`:
```bash
firebase deploy --only firestore:rules
```
The rules ensure:
- Users can read their own `users/{userId}` record.
- Users can create their record on signup with `plan: 'free'` only.
- Users can update their profile name and preferences, but **cannot modify** any subscription fields (`plan`, `status`, `subscriptionId`, `customerId`, `currentPeriodEnd`).
- Subscription fields can only be modified server-side by `firebase-admin` inside `/api/dodo/webhook`.

---

## Dodo Payments Setup & Webhook Testing

### 1. Create Product in Dodo Payments Dashboard
1. Go to **Products** -> **New Product**.
2. Select **Subscription (Recurring Monthly)**.
3. Set the price (e.g. $9.99/mo).
4. Copy the `product_id` (e.g., `pdt_...`) into `DODO_PRODUCT_ID` and `NEXT_PUBLIC_DODO_PRODUCT_ID`.

### 2. Configure Webhook Endpoint
1. Go to **Developer** -> **Webhooks** -> **Add Endpoint**.
2. URL: `https://your-domain.vercel.app/api/dodo/webhook` (or your ngrok URL for local development).
3. Select events:
   - `subscription.active`
   - `subscription.renewed`
   - `subscription.cancelled`
   - `subscription.failed`
   - `subscription.on_hold`
   - `payment.succeeded`
4. Copy the **Signing Secret** (`whsec_...`) into `DODO_WEBHOOK_SECRET`.

### 3. Testing the Webhook Locally
You can test the webhook endpoint using the Svix CLI or curl.

#### Simulating a Subscription Activation Event:
```bash
curl -X POST http://localhost:3000/api/dodo/webhook \
  -H "Content-Type: application/json" \
  -H "webhook-id: msg_test_123" \
  -H "webhook-timestamp: 1710000000" \
  -H "webhook-signature: v1,test_signature" \
  -d '{
    "business_id": "bus_123",
    "type": "subscription.active",
    "timestamp": "2026-03-24T12:00:00Z",
    "data": {
      "subscription_id": "sub_test_999",
      "status": "active",
      "next_billing_date": "2026-04-24T12:00:00Z",
      "customer": {
        "customer_id": "cus_123",
        "email": "driver@example.com"
      },
      "metadata": {
        "uid": "YOUR_FIREBASE_UID"
      }
    }
  }'
```
*(Note: When `DODO_WEBHOOK_SECRET` is set, the request must have a valid Svix cryptographic signature computed over the raw payload body).*

---

## Vercel Deployment

1. Push your repository to GitHub.
2. In the Vercel Dashboard, import the repository.
3. In **Environment Variables**, add all keys listed in `.env.example`.
4. Deploy.
5. In Dodo Payments Dashboard, update your Webhook URL to `https://your-app.vercel.app/api/dodo/webhook`.

---

## Known Limitations (What Needs a Real Backend Later)

While this application achieves extreme efficiency and zero-server operating costs by leveraging browser-side data fetching and Firebase, the following capabilities will require a dedicated backend infrastructure if scaled to enterprise live broadcasting:

1. **True Low-Latency WebSocket/SignalR Live Streaming**:
   - Upstream F1 SignalR live feeds broadcast over private zlib DEFLATE compressed binary sockets (`CarData.z` and `Position.z`).
   - Browser clients cannot connect directly to official Formula 1 timing sockets without CORS and proprietary authentication blocks.
   - A dedicated backend proxy (Node.js/Go) with Redis Pub/Sub would be needed to ingest the raw upstream socket, decompress telemetry frames at ~3.7 Hz, and fan them out via WebSockets to thousands of browser clients simultaneously.

2. **OpenF1 Free Tier Rate Limits**:
   - The public OpenF1 REST API limits traffic to 30 requests/minute per IP address.
   - If a user opens multiple browser tabs or aggressively refreshes telemetry during live track sessions, they will encounter HTTP 429.
   - A server-side Redis caching tier would pool queries for the entire userbase, eliminating client-side rate limits.

3. **Machine Learning Pipeline & Model Training**:
   - The current predictor uses mathematical heuristics and statistical weights in TypeScript.
   - Deep machine learning models (Gradient Boosting, LightGBM, neural networks trained on Fast-F1 historical datasets) require a Python model serving backend (FastAPI / Triton) or ONNX web runtime for multi-megabyte weight tensors.

4. **Team Radio & Real-Time Doppler Radar**:
   - Uncompressed broadcast radio MP3 feeds and high-resolution Doppler radar maps require dedicated object storage (S3/Cloud Storage) and background transcoders.

