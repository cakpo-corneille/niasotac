# NIASOTAC - E-Commerce Showcase Platform

## Project Overview
NIASOTAC is a full-stack e-commerce showcase platform built with Django REST Framework backend and React (Vite) frontend. The application displays technology products with features like categories, promotions, newsletter, and contact forms.

## Architecture
- **Frontend**: React 18 with TypeScript, Vite, TailwindCSS, Shadcn/UI components
- **Backend**: Django 4.2, Django REST Framework, PostgreSQL (production) / SQLite (dev)
- **API**: RESTful API with JWT authentication support
- **Features**: Product catalog, hierarchical categories, promotions, newsletter subscription, contact forms

## Project Structure
```
.
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom React hooks
│   │   └── lib/          # API utilities
│   └── dist/             # Production build output
├── backend/              # Django backend application
│   ├── src/
│   │   ├── niasotac_backend/  # Django project settings
│   │   ├── showcase/         # Main Django app
│   │   └── manage.py
│   └── requirements.txt
└── assets/              # Static assets (images, logos)
```

## Development Setup

### Environment Variables
- `DJANGO_SETTINGS_MODULE`: Set to `niasotac_backend.config.dev` for development
- `DEBUG`: Set to `True` for development
- `SECRET_KEY`: Django secret key (auto-generated for dev)

### Running Locally
The project uses two workflows:
1. **Frontend** (Port 5000): React development server with Vite
2. **Backend** (Port 8000): Django development server

The frontend proxies API requests to the backend via Vite's proxy configuration.

### Database
- Development uses SQLite (db.sqlite3)
- Production should use PostgreSQL
- Migrations are already applied

## Deployment Configuration
- **Type**: Autoscale (stateless web application)
- **Build**: Builds frontend and collects Django static files
- **Run**: Gunicorn WSGI server on port 5000 serving both API and static frontend
- **Environment**: Production settings use `niasotac_backend.config.prod`

## API Endpoints
- `/api/v1/products/` - Product listing and details
- `/api/v1/categories/` - Hierarchical category tree
- `/api/v1/promotions/active/` - Active promotions
- `/api/v1/settings/` - Site settings
- `/api/v1/newsletter/subscribe/` - Newsletter subscription
- `/health/` - Health check endpoint
- `/admin/` - Django admin interface
- `/swagger/` - API documentation (Swagger UI)

## Recent Changes (November 26, 2025)
- Initial project import and setup in Replit environment
- Installed Python 3.11 and Node.js 20 modules
- Installed all project dependencies
- Configured environment variables for development
- Applied database migrations
- Configured frontend workflow on port 5000
- Configured backend workflow on port 8000
- Set up Vite proxy for API communication
- Built frontend for production
- Configured deployment settings for Replit autoscale

## User Preferences
- Language: French (fr-fr)
- Tech stack: Django + React with TypeScript
- UI Framework: Shadcn/UI with TailwindCSS

## Notes
- The frontend is configured to allow all hosts (required for Replit iframe proxy)
- CORS is permissive in development mode
- Static files are served via Whitenoise in production
- The application supports both development (separate frontend/backend) and production (unified) modes
