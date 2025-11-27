# NIASOTAC TECHNOLOGIE - Frontend Interface Client

## Overview

NIASOTAC TECHNOLOGIE is a modern e-commerce showcase application built for a tech reseller in Benin. The application provides a responsive, user-friendly interface for browsing computers, components, printers, and accessories. It features a product catalog with advanced filtering, category navigation, product detail pages, and integration with WhatsApp for customer communication.

The frontend is a single-page application (SPA) built with React 18, TypeScript, and Vite, consuming a Django REST API backend for dynamic content.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Stack

**Core Technologies:**
- **React 18.3** - Component-based UI library using functional components and hooks
- **TypeScript 5.8** - Type-safe JavaScript with relaxed strictness settings (`strict: false`)
- **Vite 5.4** - Fast development server and optimized production builds

**UI Framework:**
- **Tailwind CSS 3.4** - Utility-first CSS with custom design tokens
- **shadcn/ui** - Pre-built, customizable component library based on Radix UI primitives
- **Lucide React** - Icon library for consistent iconography

**Routing & State:**
- **React Router 6** - Client-side routing with lazy-loaded pages
- **TanStack Query 5** - Server state management with caching, retry logic, and optimistic updates

### Design System

The application uses a custom design system defined in CSS variables (`src/index.css`):
- **Color Palette**: HSL-based colors with primary (blue: `hsl(208 100% 36%)`), accent (green: `hsl(145 100% 39%)`), and semantic colors
- **Typography**: Inter font family with system fallbacks
- **Theme Support**: Dark mode prepared but not fully implemented
- **Component Variants**: Consistent button, card, badge, and form component styles

### Architecture Patterns

**Component Structure:**
- **Page Components** (`src/pages/`): Route-level components (Home, Products, ProductDetail, Services, Contact)
- **Feature Components** (`src/components/`): Reusable business logic components (ProductCard, CategoryCard, ProductGallery, etc.)
- **UI Components** (`src/components/ui/`): Generic shadcn/ui components
- **Layout Components**: Navbar, Footer, HeroSection

**State Management Strategy:**
- **Server State**: Managed by TanStack Query with 5-minute stale time and 2 retries
- **URL State**: Search params for filters, categories, and pagination
- **Local State**: React useState for forms, UI interactions, and component-specific state
- **Error Handling**: Centralized error boundary with structured logging, plus per-mutation error handling via toast notifications

**Data Fetching:**
- API client (`src/lib/api.ts`) provides typed GET/POST methods
- Proxy configuration in Vite redirects `/api` to backend (`http://localhost:8000`)
- Mock data fallbacks (`src/lib/mockData.ts`) for development when API is unavailable
- Custom hooks (`src/hooks/`) encapsulate API queries: `useProducts`, `useCategories`, `useSiteSettings`, `useServices`

**Performance Optimizations:**
- **Code Splitting**: Manual chunks for react-vendor, ui-vendor, query-vendor in build configuration
- **Lazy Loading**: Route-based code splitting with React.lazy and Suspense
- **Image Optimization**: Lazy loading images with error fallbacks
- **Caching**: TanStack Query caches API responses with configurable stale times
- **Build Optimization**: esbuild minification, tree-shaking, console/debugger removal in production

### Key Features

**Product Catalog:**
- Grid layout with responsive cards (2 per row on mobile >360px)
- Featured products section (is_featured flag)
- New products carousel with auto-rotation
- Product badges: category icon, status (Featured/New/Recommended), discount percentage
- Image-dominant card design (98% image, minimal overlays)

**Product Detail Page:**
- Gallery with auto-rotating thumbnails (5-second intervals, pause on interaction)
- Click thumbnail to set as main image
- Product information: name, description, price, promo, stock status
- WhatsApp CTA button with tracking capability
- Similar products recommendation grid
- Newsletter signup form

**Filtering & Search:**
- Text search across product names/descriptions
- Category filter with icon badges (fixed bottom band on Products page)
- Price range, promo, and stock availability filters
- Sorting by price, date, popularity
- Pagination with skeleton loaders

**Newsletter System:**
- Email subscription with GDPR consent checkbox
- Visual feedback (success/error states)
- Backend integration via `/api/v1/newsletter/subscribers/`
- Source tracking (footer, page, etc.)

**WhatsApp Integration:**
- Fixed floating button on all pages
- Product-specific WhatsApp links with pre-filled messages
- Dynamic phone number from site settings API

### Error Handling & Logging

**Error Boundary:**
- Catches React component errors
- Structured error logging with stack traces, context, timestamp, user agent, URL
- Graceful fallback UI with retry option

**API Error Handling:**
- Centralized logging in `api.ts` with detailed error context
- Per-mutation error toasts via sonner
- Network error recovery with retry logic (2 retries by default)

**Validation:**
- Zod schemas for form validation (contact form, newsletter)
- Input sanitization and length limits
- Visual error feedback in forms

### Responsive Design

**Breakpoints:**
- Mobile-first approach with Tailwind's default breakpoints
- 2-column product grid for screens >360px
- Carousel navigation buttons hidden on mobile, visible on desktop
- Fixed category band at bottom on mobile for easy access

**Accessibility:**
- Semantic HTML structure
- ARIA labels and roles where appropriate
- Focus management for modals and interactive elements
- Alt text for images with fallback handling

### Build & Deployment

**Development:**
- Vite dev server on `localhost:5000`
- Hot module replacement (HMR) for fast development
- API proxy to Django backend

**Production Build:**
- Optimized bundle with code splitting
- Source maps in development mode only
- Console/debugger stripping in production
- Asset optimization and minification
- Chunk size warning limit: 1000KB

**Configuration:**
- TypeScript with relaxed strictness for rapid development
- ESLint with React hooks and refresh plugins
- Path aliases (`@/*` → `./src/*`) for clean imports

## External Dependencies

**Backend API:**
- Django REST Framework API at `/api/v1/`
- Endpoints: `/products/`, `/categories/`, `/services/`, `/settings/`, `/newsletter/subscribers/`
- JWT authentication prepared (token endpoint exists) but not actively used
- CORS and proxy configuration required for local development

**Third-Party Services:**
- **WhatsApp Business API**: Direct links for customer communication
- **Google Fonts**: Inter font family loaded via CDN
- **Unsplash**: Placeholder/mock product images in development

**UI Libraries:**
- **Radix UI Primitives**: ~25 components (Dialog, Dropdown, Accordion, etc.) providing accessible base components
- **Embla Carousel**: Carousel functionality with auto-play and navigation
- **date-fns**: Date formatting and manipulation
- **react-hook-form**: Form state management with Zod resolver
- **class-variance-authority**: Type-safe component variants
- **clsx + tailwind-merge**: Conditional CSS class merging

**Development Tools:**
- **lovable-tagger**: Component tagging in development mode (disabled in production)
- **ESLint**: Code linting with TypeScript and React rules
- **PostCSS + Autoprefixer**: CSS processing