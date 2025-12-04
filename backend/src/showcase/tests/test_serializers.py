"""
Tests pour les serializers
"""
from decimal import Decimal
from django.test import TestCase, RequestFactory
from rest_framework.test import APIRequestFactory

from ..models import Category, Product, ProductImage, ProductStatus, Service, SiteSettings
from ..serializers import (
    CategorySerializer, CategoryListSerializer, CategoryDetailSerializer,
    ProductListSerializer, ProductDetailSerializer,
    ServiceSerializer, SiteSettingsSerializer
)
from .utils import generate_image_file


class CategorySerializerTests(TestCase):
    """Tests pour les serializers de catégorie"""

    def setUp(self):
        self.factory = APIRequestFactory()
        self.parent = Category.objects.create(name='Ordinateurs')
        self.child = Category.objects.create(name='Portables', parent=self.parent)

    def test_category_serializer(self):
        """Test serializer de base"""
        serializer = CategorySerializer(self.parent)
        data = serializer.data
        self.assertEqual(data['name'], 'Ordinateurs')
        self.assertIn('slug', data)

    def test_category_list_serializer(self):
        """Test serializer de liste"""
        serializer = CategoryListSerializer(self.parent)
        data = serializer.data
        self.assertEqual(data['name'], 'Ordinateurs')
        self.assertIn('level', data)

    def test_category_detail_serializer(self):
        """Test serializer de détail"""
        serializer = CategoryDetailSerializer(self.parent)
        data = serializer.data
        self.assertEqual(data['name'], 'Ordinateurs')
        self.assertIn('children', data)
        self.assertIn('breadcrumb', data)


class ProductSerializerTests(TestCase):
    """Tests pour les serializers de produit"""

    def setUp(self):
        self.factory = APIRequestFactory()
        self.request = self.factory.get('/')
        self.category = Category.objects.create(name='Audio')
        self.product = Product.objects.create(
            name='Sony WH-1000XM4',
            brand='Sony',
            price=Decimal('185000.00'),
            characteristics='Casque Bluetooth avec ANC',
            category=self.category,
            is_in_stock=True,
        )
        self.status = self.product.status
        self.image = ProductImage.objects.create(
            product=self.product,
            image=generate_image_file(),
            is_primary=True
        )

    def test_product_list_serializer(self):
        """Test serializer de liste"""
        serializer = ProductListSerializer(self.product, context={'request': self.request})
        data = serializer.data
        self.assertEqual(data['name'], 'Sony WH-1000XM4')
        self.assertEqual(data['brand'], 'Sony')
        self.assertIn('price', data)

    def test_product_detail_serializer(self):
        """Test serializer de détail"""
        serializer = ProductDetailSerializer(self.product, context={'request': self.request})
        data = serializer.data
        self.assertEqual(data['name'], 'Sony WH-1000XM4')
        self.assertIn('characteristics', data)


class ServiceSerializerTests(TestCase):
    """Tests pour les serializers de service"""

    def setUp(self):
        self.service = Service.objects.create(
            title='Livraison Rapide',
            description='Livraison sous 48h',
            order=1,
            is_active=True,
        )

    def test_service_serializer(self):
        """Test serializer de service"""
        serializer = ServiceSerializer(self.service)
        data = serializer.data
        self.assertEqual(data['title'], 'Livraison Rapide')
        self.assertIn('slug', data)
