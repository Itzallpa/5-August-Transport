---
name: 5 August Transport
description: Professional nationwide corporate logistics and fleet enterprise
colors:
  primary: "#D32F2F"
  primary-hover: "#B71C1C"
  primary-light: "#FFEBEE"
  navy-dark: "#0F172A"
  charcoal-dark: "#111827"
  slate-muted: "#64748B"
  neutral-bg: "#020617"
  surface-card: "#0F172A"
  white: "#FFFFFF"
  accent-green: "#10B981"
  accent-amber: "#F59E0B"
  accent-blue: "#3B82F6"
  scrollbar-track: "#F1F5F9"
  scrollbar-thumb: "#CBD5E1"
  scrollbar-hover: "#94A3B8"
  panel-border: "rgba(226, 232, 240, 0.8)"
typography:
  headline:
    fontFamily: "var(--font-kanit), 'Kanit', sans-serif"
    fontWeight: 800
    lineHeight: 1.15
  body:
    fontFamily: "var(--font-kanit), var(--font-inter), sans-serif"
    fontWeight: 400
    lineHeight: 1.6
  numeric:
    fontFamily: "var(--font-inter), monospace, sans-serif"
    fontWeight: 700
rounded:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.white}"
    rounded: "{rounded.md}"
    padding: "14px 28px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  card-dark:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.white}"
    rounded: "{rounded.lg}"
    padding: "24px"
---

# Design System

## Overview
The design system for **5 August Transport Company Limited (บริษัท 5 สิงหา ทรานสปอร์ต จำกัด)** conveys enterprise dependability, speed, safety, and modern technological logistics infrastructure. It merges bold commercial transport aesthetics with clean, scannable data layouts.

## Colors
- **Primary Brand Red (`#D32F2F`):** Used for focal brand moments, hero accents, key CTA buttons, active status badges, and primary contact highlights.
- **Deep Red Hover (`#B71C1C`):** Micro-interaction state for interactive brand elements.
- **Dark Navy (`#0F172A`) & Charcoal (`#111827`):** Foundation backgrounds establishing a premium control-room atmosphere for operations and hero views.
- **Slate Gray (`#64748B` / `#94A3B8`):** Secondary text, specifications, dividers, and passive borders.
- **Clean White (`#FFFFFF`):** High-contrast headlines, card content, and light background sections.
- **Status Accents:** Emerald Green (`#10B981`) for approvals, Amber (`#F59E0B`) for pending reviews, Purple (`#A855F7`) for partner assignments.

## Typography
- **Primary Headline Font:** `Kanit` (weights 500, 600, 700, 800) for strong Thai headlines, slogans, and category tags.
- **Body & Numerical Font:** `Inter` and `Kanit` for clear readability across dense tables, technical dimensions, vehicle payloads, and contact information.

## Layout
- **Container Max Width:** `max-w-7xl` (1280px) centered with responsive padding (`px-4 sm:px-6 lg:px-8`).
- **Vertical Rhythm:** Generous spacing (`py-16 sm:py-24`) separating narrative sections.
- **Grid Systems:** 12-column layouts for split hero and recruitment sections; 3-column / 4-column responsive grids for vehicle categories and dashboard cards.

## Elevation & Depth
- **Glassmorphism:** Dark translucent panels with `backdrop-blur-md` and `border-slate-800` for high-tech control center feel.
- **Card Shadows:** `shadow-xl` and `shadow-2xl` with subtle colored glows (`shadow-red-900/30`) on primary callouts.

## Shapes
- **Corner Radii:** Consistent `rounded-xl` (12px) for interactive buttons and inputs; `rounded-2xl` (16px) for cards; `rounded-3xl` (24px) for major section modules and modals.

## Components
- **Navbar:** Sticky translucent header with brand badge, hotline link, and quick portal access.
- **Fleet Cards:** Feature-rich cards with payload, dimensions, cubic volume badges, and direct call-to-action.
- **Quote Calculator:** Interactive cost estimator with instantaneous region-based recalculation.
- **Driver Recruitment Form:** High-contrast form fields with Zod validation, mock file upload, and celebratory feedback modal.
- **Admin Data Table:** Comprehensive data management table with search, status filters, partner allotment modals, and real-time metric cards.

## Do's and Don'ts
- **DO:** Maintain high contrast between text and backgrounds (white on dark navy, or charcoal on slate-50).
- **DO:** Keep vehicle specifications accurate (metric tons, dimensions, and volume).
- **DO:** Keep KEX highlighted as the default strategic partner.
- **DON'T:** Use low-contrast gray text on dark backgrounds.
- **DON'T:** Overcrowd cards with unnecessary decoration; let typography and iconography drive visual hierarchy.
