"""
Tests API pour les catégories (ancienne version - mise à jour)
"""
from decimal import Decimal
from django.test import TestCase
from rest_framework.test import APIClient
from django.urls import reverse
from django.contrib.auth.models import User

from ...models import Category, Product, ProductImage
from ..utils import generate_image_file


class CategoryAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_superuser(username='admin', password='pass')
        self.user = User.objects.create_user(username='user', password='pass')
        self.parent = Category.objects.create(name='Électronique', slug='electronique')
        self.child = Category.objects.create(name='Audio', slug='audio', parent=self.parent)
        self.product = Product.objects.create(
            name='AirPods Pro',
            brand='Apple',
            category=self.child,
            price=Decimal('299990.00'),
            characteristics='Casque haut de gamme',
        )
        ProductImage.objects.create(
            product=self.product,
            image=generate_image_file(),
            is_primary=True
        )

    def test_main_categories(self):
        url = '/api/v1/categories/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

    def test_category_products(self):
        url = f'/api/v1/categories/{self.child.slug}/products/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
