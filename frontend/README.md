# NIASOTAC Frontend - React + Vite + TypeScript

## Overview

NIASOTAC frontend is a modern, responsive e-commerce web application built with React, Vite, and TypeScript. It provides a seamless shopping experience with product browsing, category navigation, newsletter subscription, and WhatsApp integration for orders.

## Project Structure

```
frontend/
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── Navbar.tsx         # Navigation with category menu
│   │   ├── HeroSection.tsx    # Landing hero section
│   │   ├── ProductCard.tsx    # Individual product card
│   │   ├── ProductGallery.tsx # Product image gallery/lightbox
│   │   ├── CategoryCard.tsx   # Category selection card
│   │   ├── CategoryBand.tsx   # Category filter band
│   │   ├── ProductSkeleton.tsx # Loading skeleton
│   │   ├── NewsletterForm.tsx # Email subscription form
│   │   ├── ContactForm.tsx    # Contact/inquiry form
│   │   ├── WhatsAppButton.tsx # WhatsApp action button
│   │   ├── Footer.tsx         # Site footer with info
│   │   ├── ScrollToTop.tsx    # Scroll-to-top utility
│   │   └── ErrorBoundary.tsx  # React error handling
│   │
│   ├── pages/                 # Page-level components
│   │   ├── Home.tsx           # Landing page
│   │   ├── ProductList.tsx    # Product catalog with filters
│   │   ├── ProductDetail.tsx  # Single product page
│   │   ├── CategoryProducts.tsx # Products by category
│   │   ├── Contact.tsx        # Contact page
│   │   └── NotFound.tsx       # 404 page
│   │
│   ├── hooks/                 # Custom React hooks
│   │   ├── useProducts.ts     # Product API queries
│   │   ├── useCategories.ts   # Category API queries
│   │   ├── useSiteSettings.ts # Site configuration
│   │   ├── useServices.ts     # Service offerings
│   │   ├── use-toast.ts       # Toast notifications
│   │   └── use-mobile.tsx     # Mobile detection
│   │
│   ├── lib/                   # Utilities and services
│   │   ├── api.ts             # Backend API client
│   │   ├── utils.ts           # Helper functions (cn, formatting)
│   │   ├── newsletter.ts      # Newsletter service
│   │   ├── mockData.ts        # Fallback data for offline
│   │   └── categoryIcons.tsx  # Category icon mapping
│   │
│   ├── App.tsx                # Main app component with routing
│   ├── main.tsx               # React DOM entry point
│   ├── index.css              # Global Tailwind styles
│   └── vite-env.d.ts          # Vite TypeScript definitions
│
├── public/                    # Static assets
├── package.json               # Dependencies & scripts
├── vite.config.ts             # Vite dev server configuration
├── tsconfig.json              # TypeScript configuration
└── tailwind.config.js         # Tailwind CSS configuration
```

## Core Features

### 1. Product Catalog
- **Browse Products**: Grid layout with responsive cards
- **Product Details**: Rich product page with:
  - Multiple images with gallery/lightbox
  - Price with discount calculations
  - Stock status indicators
  - Characteristics as formatted bullet points
  - WhatsApp order button
  - Related products
- **Search & Filter**: 
  - By category, brand, price range
  - Sort by price, newest, popularity
  - Real-time search results
  - Pagination with configurable page size

### 2. Category Navigation
- **Hierarchical Menu**: Nested categories in navigation
- **Category Pages**: Browse products by category
- **Breadcrumb Navigation**: Clear location indication
- **Visual Categories**: Icon-based category display with custom icons

### 3. Product Characteristics Display
- **Formatted Bullet Points**: Clean presentation of product specs
- **Positioned Below CTA**: After "Commander via WhatsApp" button
- **Dynamic Rendering**: Automatically parsed from backend data
- **Examples**:
  - ✓ Wireless with 40-hour battery life
  - ✓ Active Noise Cancellation (ANC)
  - ✓ Touch and voice controls
  - ✓ Seamless device switching

### 4. Newsletter System
- **Email Subscription**: Simple, user-friendly signup form
- **Double Opt-In**: Verification email sent automatically
- **Complete Disappearance**: Newsletter form vanishes after email confirmation
- **Secure Process**: Only verified subscribers receive campaigns
- **User Experience**: Clear confirmation messages and loading states

### 5. WhatsApp Integration
- **One-Click Ordering**: Pre-filled WhatsApp messages with product details
- **Message Includes**:
  - Product name and brand
  - Price with discount information
  - Direct link to product page
  - Unique identifiers for order tracking
- **Click Analytics**: Track WhatsApp engagement from products
- **Configurable**: Business WhatsApp number set in backend

### 6. Responsive Design
- **Mobile-First**: Optimized for all screen sizes (360px+)
- **Touch-Friendly**: Large buttons and easy navigation
- **Fast Loading**: Skeleton screens and lazy image loading
- **Accessible**: WCAG compliance with alt text and ARIA labels

## Pages

### Home Page
- Hero section with main CTA
- Featured products carousel
- Category selection band
- Services highlight
- Newsletter signup section
- Contact quick link

### Product List Page
- Product grid with responsive layout
- Category/brand filter sidebar
- Price range slider
- Real-time search bar
- Sort options (price, newest, popularity)
- Pagination controls
- Product count display

### Product Detail Page
- Product image gallery with zoom
- Product information section
- Price display with discount badge
- Stock status indicator
- Formatted characteristics list
- WhatsApp order button
- Related/recommended products
- Share functionality

### Category Page
- Category name and breadcrumb
- All products in category
- Subcategory navigation
- Filter and sort options
- Pagination

### Contact Page
- Contact form with validation
- Company information
- Social media links
- WhatsApp contact button
- Email address

## Technology Stack

### Core
- **React 18.3.1** - UI library with hooks
- **TypeScript 5.8** - Type-safe development
- **Vite 7.x** - Fast dev server and production build

### Styling & Components
- **Tailwind CSS 4** - Utility-first CSS framework
- **shadcn/ui** - Pre-built, customizable components
- **Lucide React** - Icon library

### State Management
- **TanStack Query** - Server state management with caching
- **React Router 6** - Client-side routing
- **React Hook Form** - Form state management

### Utilities
- **Axios** - HTTP client
- **Sonner** - Toast notifications
- **Heroicons** - Additional icon set

## Custom Hooks

### API Data Hooks
```typescript
useProducts(filters)     // Fetch products with filtering
useCategories()          // Get category hierarchy
useSiteSettings()        // Get global settings
useServices()            // Fetch service offerings
```

### UI Hooks
```typescript
useToast()               // Show notifications
useMobile()              // Detect mobile viewport
```

## API Integration

### Backend API Client (`lib/api.ts`)

Base URL: `/api/v1` (proxied to backend)

**Methods:**
- `getProducts(filters)` - List products with pagination/filters
- `getProduct(slug)` - Single product details
- `getCategories()` - Hierarchical categories
- `getCategoryProducts(slug)` - Products by category
- `getSettings()` - Site configuration
- `getServices()` - Service offerings
- `subscribeNewsletter(email, name)` - Newsletter signup
- `trackProductClick(slug)` - Track WhatsApp engagement

### Error Handling
- Global error boundary for component crashes
- API error interceptors with user messages
- Offline fallback with mock data
- Automatic retry logic for failed requests
- Toast notifications for user feedback

## Styling System

### Tailwind CSS Configuration
- Utility-first approach
- Custom theme in `tailwind.config.js`
- Responsive breakpoints (mobile-first)
- Dark mode support (prepared)
- Custom color palette (primary: blue, accent: green)

### Design Tokens
- **Colors**: HSL-based with CSS variables
- **Typography**: Inter font family
- **Spacing**: Consistent 4px grid
- **Shadows**: Subtle elevation system
- **Border Radius**: Consistent rounded corners

## Performance Optimizations

- **Code Splitting**: Route-based lazy loading
- **Image Optimization**: Lazy loading with error fallbacks
- **Caching**: TanStack Query with 5-minute stale time
- **Bundle**: Vite minification and tree-shaking
- **CSS**: Tailwind purging unused styles
- **Build**: Optimized chunk splitting for vendors

## Running the Application

### Development
```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:5000` (accessible via Replit webview)

### Building for Production
```bash
npm run build
npm run preview
```

Generates optimized files in `dist/` folder

### Type Checking
```bash
npm run type-check
```

## Environment Configuration

```env
# Frontend variables (in .env)
VITE_API_BASE_URL=/api/v1
VITE_APP_NAME=NIASOTAC
```

**Note:** Frontend proxies `/api` to backend via Vite dev server

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari 14+, Chrome Mobile)

## Key Features

✅ Fast development with Vite HMR
✅ Full TypeScript support with type safety
✅ Responsive mobile-first design
✅ Advanced product filtering and search
✅ WhatsApp integration for orders
✅ Newsletter with double opt-in
✅ Error boundaries and fallback UI
✅ Loading states with skeleton screens
✅ Accessible UI components (WCAG)
✅ Clean, maintainable code architecture
✅ Lazy loading and code splitting
✅ Mock data offline fallback

## Deployment

### Build Production Bundle
```bash
npm run build
```

### Serve Locally
```bash
npm run preview
```

### Deploy to Hosting
Upload contents of `dist/` to your hosting provider or CDN

### Backend Configuration
Ensure backend API is accessible at configured URL

## Component Examples

### Using Product Hook
```typescript
const { data, isLoading, error } = useProducts({ 
  category: 'electronics',
  search: 'laptop',
  sort: 'price'
});
```

### Using API Client
```typescript
const products = await api.getProducts({ page: 1 });
const settings = await api.getSettings();
```

### Toast Notifications
```typescript
const { toast } = useToast();
toast({
  title: "Success",
  description: "Email verified!",
});
```

## Troubleshooting

### API Connection Issues
- Check backend is running (port 8000)
- Verify Vite proxy configuration in `vite.config.ts`
- Check browser console for CORS errors
- Check Network tab for failed requests

### Styling Issues
- Clear Tailwind cache: `rm -rf node_modules/.cache`
- Restart dev server: `npm run dev`
- Check for conflicting CSS classes
- Verify Tailwind config includes all `src/` paths

### Performance Issues
- Use React DevTools Profiler
- Check Network tab for slow API calls
- Review bundle size: `npm run build` report
- Use Lighthouse in browser DevTools

### Build Errors
- Clear cache: `rm -rf dist node_modules/.cache`
- Reinstall dependencies: `npm install`
- Check Node.js version (16+)
- Review TypeScript errors: `npm run type-check`

## Contributing

- Keep components small (max 200 lines)
- Use TypeScript for type safety
- Follow existing code patterns
- Add tests for new features
- Document complex logic with comments
- Use meaningful variable names

## Version

Current Version: 1.0.0
Last Updated: November 29, 2025

## License

© 2025 NIASOTAC TECHNOLOGIE. All rights reserved.
