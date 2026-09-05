# EMP-Dashboard — SvelteKit + shadcn-svelte + TypeScript

A clean, **Notion-grade**, production-ready role-based Employee & Admin Dashboard suite built with **SvelteKit 2**, **Svelte 5 Runes**, **shadcn-svelte (Tailwind v4)**, and **TypeScript**.

## Architecture & Tech Stack
- **Framework**: SvelteKit 2 (`@sveltejs/kit`) with Svelte 5 runes (`$state`, `$derived`, `$props`)
- **UI System**: shadcn-svelte design system (`@lib/components/ui/`)
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`) + CSS Variables for Notion-grade dark mode
- **Type Safety**: TypeScript 6 (`tsconfig.json`)
- **Iconography**: `@lucide/svelte`
- **Component Primitives**: `bits-ui` headless primitives + `tailwind-variants`

---

## 8 Specialized Role Dashboards

| Route | Role | Custom Railbar Components |
|---|---|---|
| [`/super-admin`](http://localhost:5173/super-admin) | **Super Admin** | Global Node Clusters monitor (US/EU/AP), Emergency Lockdown toggle, Ingress rate limits, Immutable SOC2 audit stream |
| [`/admin-analytics`](http://localhost:5173/admin-analytics) | **Platform Analytics** | Concurrent user live ticker (`14,892`), Q3 MRR target progress (`$84.2k/$100k`), Conversion funnel, Regional edge latency |
| [`/reviewer`](http://localhost:5173/reviewer) | **Content QA Reviewer** | Daily Review Quota (`142/200`), P1 SLA urgency countdown timer, Human quality scoring slider, Golden dataset evaluation |
| [`/ml-analyst`](http://localhost:5173/ml-analyst) | **ML Research & Ops** | GPU Cluster Allocations (`8x H100`, `16x A100`, `4x V100`), Active DPO/RLHF loss curves, SOTA Checkpoint Registry |
| [`/fraud-compliance`](http://localhost:5173/fraud-compliance) | **Fraud & Trust** | Realtime threat radar (`1,429 blocked/hr`), Emergency IP quick-ban tool, Anomaly velocity stream, KYC/OFAC sanctions log |
| [`/coupon-manager`](http://localhost:5173/coupon-manager) | **Coupons & Billing** | Promo budget burn meter, Instant promo code generator (`SUMMER2026`), Stripe dunning recovery queue, Quota overages |
| [`/operations`](http://localhost:5173/operations) | **DevOps & Platform SRE** | Kubernetes Pod Health (`124/124 Healthy`), Redis cache hit rate (`98.4%`), pgBouncer pool saturation, Kafka offset lag |
| [`/support`](http://localhost:5173/support) | **VIP Customer Support** | Priority ticket queue (`P1/P2/P3`), CSAT rating meter (`4.92 ★`), Live chat triage, High-MRR churn risk watchlist |

---

## Running Locally

```bash
cd EMP-Dashboard
npm run dev
# Or with pnpm:
pnpm run dev
```

Navigate to `http://localhost:5173/` which automatically redirects to `/super-admin`. Use the workspace switcher at the top of the **Railbar** or the top navigation bar to seamlessly jump between all 8 role dashboards.
