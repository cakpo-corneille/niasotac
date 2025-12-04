"""
Tests API pour les produits (ancienne version - mise à jour)
"""
from decimal import Decimal
from django.test import TestCase
from rest_framework.test import APIClient
from django.urls import reverse
from django.contrib.auth.models import User

from ..utils import generate_image_file
from ...models import Category, Product, ProductImage, ProductStatus, SiteSettings


class ProductAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_superuser(username='admin', password='pass')
        self.user = User.objects.create_user(username='user', password='pass')
        self.category = Category.objects.create(name='Audio', slug='audio')
        self.product = Product.objects.create(
            name='AirPods Pro',
            brand='Apple',
            category=self.category,
            price=Decimal('299990.00'),
            characteristics='Casque haut de gamme',
            is_in_stock=True,
        )
        ProductImage.objects.create(
            product=self.product,
            image=generate_image_file(),
            is_primary=True
        )
        self.status = ProductStatus.objects.create(
            product=self.product,
            is_featured=True,
            featured_score=0.8
        )

    def test_list_products(self):
        url = '/api/v1/products/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertIn('results', response.data)

    def test_featured_products(self):
        url = '/api/v1/products/featured/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

    def test_recent_products(self):
        url = '/api/v1/products/recent/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

    def test_stats_endpoint(self):
        url = '/api/v1/products/stats/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
