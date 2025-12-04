"""
Tests complets pour les vues API
"""
from decimal import Decimal
from django.test import TestCase, override_settings
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse
from django.contrib.auth.models import User

from ...models import (
    Category, Product, ProductImage, ProductStatus,
    Service, SiteSettings, NewsletterSubscriber
)
from ..utils import generate_image_file


class CategoryAPITests(TestCase):
    """Tests API pour les catégories"""

    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_superuser(username='admin', password='pass123')
        self.parent = Category.objects.create(name='Ordinateurs')
        self.child = Category.objects.create(name='Portables', parent=self.parent)

    def test_list_categories(self):
        """Test liste des catégories"""
        url = '/api/v1/categories/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data['results']), 1)

    def test_retrieve_category(self):
        """Test détail d'une catégorie"""
        url = f'/api/v1/categories/{self.parent.slug}/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Ordinateurs')

    def test_category_tree(self):
        """Test arborescence des catégories"""
        url = '/api/v1/categories/tree/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, list)

    def test_category_products_endpoint(self):
        """Test endpoint produits d'une catégorie"""
        Product.objects.create(
            name='Test Laptop',
            brand='Test',
            price=Decimal('500000.00'),
            description='Test',
            category=self.child,
        )
        url = f'/api/v1/categories/{self.child.slug}/products/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_category_filter_by_level(self):
        """Test filtrage par niveau"""
        url = '/api/v1/categories/' + '?level=0'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        for cat in response.data['results']:
            self.assertEqual(cat.get('level', 0), 0)

    def test_create_category_requires_auth(self):
        """Test création catégorie nécessite auth"""
        url = '/api/v1/categories/'
        response = self.client.post(url, {'name': 'New Cat'})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_category_as_admin(self):
        """Test création catégorie en tant qu'admin"""
        self.client.force_authenticate(user=self.admin)
        url = '/api/v1/categories/'
        response = self.client.post(url, {'name': 'New Category'})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class ProductAPITests(TestCase):
    """Tests API pour les produits"""

    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_superuser(username='admin', password='pass123')
        self.category = Category.objects.create(name='Audio')
        self.product = Product.objects.create(
            name='Sony WH-1000XM4',
            brand='Sony',
            price=Decimal('185000.00'),
            characteristics='Casque Bluetooth',
            category=self.category,
            is_in_stock=True,
        )
        self.status = ProductStatus.objects.create(
            product=self.product,
            is_featured=True,
            featured_score=0.8
        )
        ProductImage.objects.create(
            product=self.product,
            image=generate_image_file(),
            is_primary=True
        )

    def test_list_products(self):
        """Test liste des produits"""
        url = '/api/v1/products/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data['results']), 1)

    def test_retrieve_product(self):
        """Test détail d'un produit"""
        url = f'/api/v1/products/{self.product.slug}/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Sony WH-1000XM4')

    def test_featured_products(self):
        """Test produits vedettes"""
        url = '/api/v1/products/featured/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_recent_products(self):
        """Test produits récents"""
        url = '/api/v1/products/recent/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_recommended_products(self):
        """Test produits recommandés"""
        url = '/api/v1/products/recommended/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_on_sale_products(self):
        """Test produits en promo"""
        self.product.compare_at_price = Decimal('225000.00')
        self.product.save()
        url = '/api/v1/products/on_sale/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data['results']), 1)

    def test_product_stats(self):
        """Test statistiques produits"""
        url = '/api/v1/products/stats/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('total_products', response.data)

    def test_filter_by_category(self):
        """Test filtrage par catégorie"""
        url = '/api/v1/products/' + f'?category_slug={self.category.slug}'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_filter_by_brand(self):
        """Test filtrage par marque"""
        url = '/api/v1/products/' + '?brand=Sony'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_filter_by_price_range(self):
        """Test filtrage par gamme de prix"""
        url = '/api/v1/products/' + '?min_price=100000&max_price=200000'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_filter_by_in_stock(self):
        """Test filtrage par disponibilité"""
        url = '/api/v1/products/' + '?is_in_stock=true'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_search_products(self):
        """Test recherche de produits"""
        url = '/api/v1/products/' + '?search=Sony'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_ordering_by_price(self):
        """Test tri par prix"""
        Product.objects.create(
            name='Cheap Product',
            brand='Test',
            price=Decimal('50000.00'),
            characteristics='Test',
            category=self.category,
        )
        url = '/api/v1/products/' + '?ordering=price'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        prices = [Decimal(p['price']) for p in response.data['results']]
        self.assertEqual(prices, sorted(prices))

    def test_track_whatsapp_click(self):
        """Test tracking clic WhatsApp"""
        url = f'/api/v1/products/{self.product.slug}/track_click/'
        initial_count = self.status.whatsapp_click_count
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.status.refresh_from_db()
        self.assertEqual(self.status.whatsapp_click_count, initial_count + 1)

    def test_create_product_requires_auth(self):
        """Test création produit nécessite auth"""
        url = '/api/v1/products/'
        response = self.client.post(url, {'name': 'New Product'})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class ServiceAPITests(TestCase):
    """Tests API pour les services"""

    def setUp(self):
        self.client = APIClient()
        self.service = Service.objects.create(
            title='Livraison Rapide',
            description='Livraison sous 48h',
            order=1,
            is_active=True,
        )

    def test_list_services(self):
        """Test liste des services"""
        url = '/api/v1/services/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data['results']), 1)

    def test_retrieve_service(self):
        """Test détail d'un service"""
        url = f'/api/v1/services/{self.service.slug}/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Livraison Rapide')


class SiteSettingsAPITests(TestCase):
    """Tests API pour les paramètres du site"""

    def setUp(self):
        self.client = APIClient()
        self.settings = SiteSettings.load()
        self.settings.company_name = 'NIASOTAC'
        self.settings.save()

    def test_get_settings(self):
        """Test récupération des paramètres"""
        url = '/api/v1/settings/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, (list, dict))


class NewsletterAPITests(TestCase):
    """Tests API pour la newsletter"""

    def setUp(self):
        self.client = APIClient()

    def test_subscribe_to_newsletter(self):
        """Test inscription à la newsletter"""
        url = '/api/v1/newsletter/subscribers/'
        response = self.client.post(url, {
            'email': 'test@example.com',
            'name': 'Test User',
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(NewsletterSubscriber.objects.filter(email='test@example.com').exists())

    def test_subscribe_duplicate_email(self):
        """Test inscription email dupliqué"""
        NewsletterSubscriber.objects.create(email='existing@example.com')
        url = '/api/v1/newsletter/subscribers/'
        response = self.client.post(url, {
            'email': 'existing@example.com',
        })
        self.assertIn(response.status_code, [status.HTTP_400_BAD_REQUEST, status.HTTP_200_OK])

    def test_subscribe_invalid_email(self):
        """Test inscription email invalide"""
        url = '/api/v1/newsletter/subscribers/'
        response = self.client.post(url, {
            'email': 'not-an-email',
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class HealthCheckTests(TestCase):
    """Tests pour le health check"""

    def setUp(self):
        self.client = APIClient()

    def test_health_check(self):
        """Test endpoint health check"""
        response = self.client.get('/health/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('status', response.data)


class PaginationTests(TestCase):
    """Tests pour la pagination"""

    def setUp(self):
        self.client = APIClient()
        self.category = Category.objects.create(name='Test')
        for i in range(25):
            Product.objects.create(
                name=f'Product {i}',
                brand='Test',
                price=Decimal('100000.00'),
                characteristics='Test',
                category=self.category,
            )

    def test_products_pagination(self):
        """Test pagination des produits"""
        url = '/api/v1/products/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('count', response.data)
        self.assertIn('results', response.data)
        self.assertIn('next', response.data)
        self.assertEqual(response.data['count'], 25)

    def test_page_size_parameter(self):
        """Test paramètre de taille de page"""
        url = '/api/v1/products/' + '?page_size=5'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 5)

    def test_page_navigation(self):
        """Test navigation entre pages"""
        url = '/api/v1/products/' + '?page=2&page_size=10'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 10)
