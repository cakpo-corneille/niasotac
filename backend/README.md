# NIASOTAC Backend API - Django REST Framework

## Overview

NIASOTAC is a full-stack e-commerce application serving as a tech reseller platform in Benin. The backend provides a comprehensive REST API for managing products, categories, newsletter subscriptions, and order management through WhatsApp integration.

## Project Structure

```
backend/src/
├── niasotac_backend/          # Django project configuration
│   ├── config/                # Environment-specific settings
│   │   ├── base.py           # Base Django settings
│   │   ├── dev.py            # Development settings
│   │   └── prod.py           # Production settings
│   ├── urls.py               # Main URL router
│   ├── wsgi.py               # WSGI application
│   └── celery.py             # Celery async task configuration
│
├── showcase/                  # Main Django app (products & commerce)
│   ├── admin/                # Django admin customizations
│   │   ├── product_admin.py  # Product management interface
│   │   ├── category_admin.py # Category management with hierarchy
│   │   ├── newsletter_admin.py # Newsletter subscriber management
│   │   └── filters.py        # Custom admin filters
│   │
│   ├── api/                  # REST API configuration
│   │   └── v1.py            # API v1 router (DRF)
│   │
│   ├── models/               # Database models
│   │   ├── product.py        # Product & ProductStatus models
│   │   ├── category.py       # Category model (hierarchical with MPPT)
│   │   ├── newsletter.py     # Newsletter & subscription models
│   │   ├── promotion.py      # Promotion & discount system
│   │   ├── service.py        # Service offerings (delivery, support, etc)
│   │   └── settings.py       # Site-wide settings (WhatsApp, contact)
│   │
│   ├── serializers.py        # DRF serializers for all models
│   ├── views.py              # ViewSets for REST endpoints
│   │
│   ├── services/             # Business logic layer
│   │   ├── scoring_service.py    # Product scoring & ranking algorithm
│   │   ├── promotion_service.py  # Promotion calculation engine
│   │   └── newsletter_service.py # Newsletter management
│   │
│   ├── tasks/                # Celery async tasks
│   │   └── email_tasks.py   # Newsletter email distribution
│   │
│   ├── tests/                # Comprehensive test suite (88 tests)
│   │   ├── test_models.py    # Model tests
│   │   ├── test_serializers.py # Serializer tests
│   │   ├── test_services.py  # Service logic tests
│   │   └── api/              # API endpoint tests
│   │       ├── test_categories.py
│   │       ├── test_products.py
│   │       └── test_views.py
│   │
│   ├── migrations/           # Database migrations
│   └── management/           # Custom management commands

├── manage.py                 # Django CLI tool
└── requirements.txt          # Python dependencies
```

## Core Features

### 1. Product Catalog Management
- **Rich Product Data**: Name, brand, price, stock status, characteristics (formatted bullet points)
- **Pricing System**: Regular price, compare-at price (for discounts), automatic discount calculation
- **Product Status Tracking**: View count, WhatsApp clicks, featured/recommended flags, scoring
- **Multiple Images**: Primary + secondary images with CDN support
- **Search & Filtering**: By category, brand, price range, stock status, search keywords

### 2. Hierarchical Categories
- **MPPT Structure**: Unlimited nesting levels (parent-child relationships)
- **Automatic Slug Generation**: URL-friendly category names
- **Full Paths**: Display category hierarchies (e.g., "Electronics > Computers > Laptops")
- **Main Category Filter**: Identify top-level categories for navigation

### 3. Product Characteristics
- **Structured Field**: Replaces simple descriptions with formatted bullet points
- **Display Support**: Frontend renders as clean list of product features
- **Optional Field**: Can be empty for products without detailed specs
- **Examples**: "Wireless 40-hour battery", "Active Noise Cancellation", "Touch controls"

### 4. Newsletter System
- **Double Opt-In**: Email verification before subscription
- **Automatic Confirmation**: Sends verification email on signup
- **Verified Only**: Non-verified subscribers don't receive campaigns
- **Complete Removal**: Verified subscribers disappear from UI after confirmation
- **Campaign Management**: Send bulk newsletters to verified subscribers

### 5. WhatsApp Integration
- **Product Sharing**: Pre-filled messages for WhatsApp orders
- **Click Tracking**: Monitor engagement via WhatsApp button clicks
- **Configurable Number**: Set WhatsApp business number in site settings
- **Message Template**: Customizable product order template

### 6. Site-Wide Settings
- **Company Info**: Name, logo, contact details
- **WhatsApp Configuration**: Business number for order integration
- **Social Links**: Facebook, Instagram, LinkedIn, etc.
- **Service Descriptions**: Customizable service offerings

## API Endpoints

### Categories
- `GET /api/v1/categories/` - List all categories (paginated)
- `GET /api/v1/categories/{slug}/` - Category detail with children
- `GET /api/v1/categories/tree/` - Full hierarchical tree
- `GET /api/v1/categories/{slug}/products/` - Products in category

### Products
- `GET /api/v1/products/` - List products with filtering/search
- `GET /api/v1/products/{slug}/` - Product detail view
- `GET /api/v1/products/featured/` - Featured products
- `GET /api/v1/products/recent/` - Recently added products
- `GET /api/v1/products/recommended/` - AI-recommended products
- `GET /api/v1/products/on_sale/` - Discounted products
- `GET /api/v1/products/stats/` - Product statistics
- `POST /api/v1/products/{slug}/track_click/` - Track WhatsApp engagement

### Newsletter
- `POST /api/v1/newsletter/subscribers/` - Subscribe to newsletter
- `GET /api/v1/newsletter/subscribers/{id}/verify/` - Verify email token

### Other
- `GET /api/v1/services/` - List services (delivery, support, etc)
- `GET /api/v1/settings/` - Site settings
- `GET /health/` - Health check endpoint

## Database Models

### Product
- Core e-commerce entity with pricing, stock, and scoring
- Auto-generated SKU and slug
- Related: Images, Status, Category

### ProductStatus
- Tracks engagement metrics (views, WhatsApp clicks)
- Scoring system for featured/recommended products
- Automatic recalculation based on activity

### Category
- Hierarchical using MPPT (Modified Preorder Tree Traversal)
- Auto-slug generation
- Support unlimited nesting

### ProductImage
- Multiple images per product
- Primary image designation
- CDN-ready with file validation

### NewsletterSubscriber
- Email, name, verification token
- Verified flag for campaign targeting
- Subscription/unsubscription dates

### Service
- Customizable service offerings
- Order-based display
- Active/inactive status

### SiteSettings
- Singleton pattern for global configuration
- WhatsApp number, company info, social links
- Cached for performance

## Technology Stack

- **Framework**: Django 5.2.8
- **API**: Django REST Framework 3.14+
- **Database**: PostgreSQL (production), SQLite (development)
- **Authentication**: JWT (djangorestframework-simplejwt)
- **Async Tasks**: Celery + Redis
- **Email**: Django mail backend
- **Hierarchical Models**: django-mppt
- **File Storage**: django-storages (S3 support)
- **CORS**: django-cors-headers
- **Documentation**: drf-yasg (Swagger/OpenAPI)
- **Monitoring**: Sentry SDK

## Running the Backend

### Development
```bash
cd backend/src
python manage.py runserver 0.0.0.0:8000
```

### Running Tests
```bash
cd backend/src
python manage.py test showcase
```

### Creating a Superuser
```bash
cd backend/src
python manage.py createsuperuser
```

### Database Migrations
```bash
cd backend/src
python manage.py makemigrations
python manage.py migrate
```

## Environment Configuration

### Development (.env)
```
DEBUG=True
DJANGO_SETTINGS_MODULE=niasotac_backend.config.dev
SECRET_KEY=your-dev-key
DATABASE_URL=sqlite:///db.sqlite3
ALLOWED_HOSTS=localhost,127.0.0.1
```

### Production (.env)
```
DEBUG=False
DJANGO_SETTINGS_MODULE=niasotac_backend.config.prod
SECRET_KEY=your-production-key
DATABASE_URL=postgresql://...
ALLOWED_HOSTS=yourdomain.com
WHATSAPP_NUMBER=+229xxxxxxxx
```

## Deployment

### Using Gunicorn
```bash
gunicorn --bind 0.0.0.0:8000 --workers 4 niasotac_backend.wsgi:application
```

### Database Setup
```bash
python manage.py migrate
python manage.py createsuperuser
```

### Static Files
```bash
python manage.py collectstatic --no-input
```

## Admin Interface

Access Django admin at `/admin/`:
- Manage products, categories, pricing
- Configure newsletter campaigns
- Set WhatsApp integration
- View engagement metrics
- Manage users and permissions

## Key Features

✅ 50+ unit tests covering core business logic
✅ Automatic product scoring for featured products
✅ Double opt-in newsletter system
✅ WhatsApp order tracking
✅ Hierarchical category management
✅ Product search and advanced filtering
✅ Pagination and sorting
✅ JWT authentication ready
✅ Full API documentation (Swagger)
✅ Health check endpoints

## Performance

- Database indexes on frequently queried fields
- Pagination (default 20 items per page)
- Caching for site settings
- Query optimization with select_related/prefetch_related
- Async email sending via Celery

## Support & Troubleshooting

- Check Django logs: `python manage.py runserver --verbosity 3`
- Admin interface: `/admin/`
- API docs: `/swagger/`
- Health check: `/health/`

## Version

Current Version: 1.0.0
Last Updated: November 29, 2025
