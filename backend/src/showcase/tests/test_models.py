"""
Tests complets pour les modèles showcase
"""
from decimal import Decimal
from django.test import TestCase
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.utils import timezone
from datetime import timedelta

from ..models import Category, Product, ProductImage, ProductStatus, Service, SiteSettings
from .utils import generate_image_file


class CategoryModelTests(TestCase):
    """Tests pour le modèle Category avec MPPT"""

    def setUp(self):
        self.parent = Category.objects.create(name='Ordinateurs')
        self.child = Category.objects.create(name='Portables', parent=self.parent)
        self.grandchild = Category.objects.create(name='Gaming', parent=self.child)

    def test_category_creation(self):
        """Test création d'une catégorie simple"""
        cat = Category.objects.create(name='Test Category')
        self.assertEqual(cat.name, 'Test Category')
        self.assertIsNotNone(cat.slug)
        self.assertTrue(cat.slug)

    def test_category_slug_generation(self):
        """Test génération automatique du slug"""
        cat = Category.objects.create(name='Ma Super Catégorie')
        self.assertIn('ma-super-categorie', cat.slug)

    def test_category_unique_slug(self):
        """Test unicité du slug"""
        cat1 = Category.objects.create(name='Audio')
        cat2 = Category.objects.create(name='Audio')
        self.assertNotEqual(cat1.slug, cat2.slug)

    def test_category_hierarchy(self):
        """Test hiérarchie parent-enfant"""
        self.assertEqual(self.child.parent, self.parent)
        self.assertIn(self.child, self.parent.get_children())

    def test_mppt_level(self):
        """Test niveaux MPPT"""
        self.assertEqual(self.parent.level, 0)
        self.assertEqual(self.child.level, 1)
        self.assertEqual(self.grandchild.level, 2)

    def test_is_main_category(self):
        """Test détection catégorie principale"""
        self.assertTrue(self.parent.is_main_category)
        self.assertFalse(self.child.is_main_category)

    def test_get_ancestors(self):
        """Test récupération des ancêtres"""
        ancestors = list(self.grandchild.get_ancestors())
        self.assertEqual(len(ancestors), 2)
        self.assertIn(self.parent, ancestors)
        self.assertIn(self.child, ancestors)

    def test_get_descendants(self):
        """Test récupération des descendants"""
        descendants = list(self.parent.get_descendants())
        self.assertEqual(len(descendants), 2)
        self.assertIn(self.child, descendants)
        self.assertIn(self.grandchild, descendants)

    def test_get_full_path(self):
        """Test chemin complet de la catégorie"""
        path = self.grandchild.get_full_path()
        self.assertEqual(path, 'Ordinateurs > Portables > Gaming')


class ProductModelTests(TestCase):
    """Tests pour le modèle Product"""

    def setUp(self):
        self.category = Category.objects.create(name='Audio')
        self.product = Product.objects.create(
            name='Sony WH-1000XM4',
            brand='Sony',
            price=Decimal('185000.00'),
            characteristics='Casque Bluetooth avec ANC',
            category=self.category,
            is_in_stock=True,
        )

    def test_product_creation(self):
        """Test création d'un produit"""
        self.assertEqual(self.product.name, 'Sony WH-1000XM4')
        self.assertEqual(self.product.brand, 'Sony')
        self.assertEqual(self.product.price, Decimal('185000.00'))
        self.assertTrue(self.product.is_in_stock)

    def test_product_slug_generation(self):
        """Test génération automatique du slug"""
        self.assertIn('sony-wh-1000xm4', self.product.slug.lower())

    def test_product_sku_generation(self):
        """Test génération automatique du SKU"""
        self.assertIsNotNone(self.product.sku)
        self.assertTrue(len(self.product.sku) > 0)

    def test_product_display_price(self):
        """Test formatage du prix"""
        display = self.product.display_price
        self.assertIn('185', display)

    def test_product_has_discount_without_compare_price(self):
        """Test pas de remise sans prix barré"""
        self.assertFalse(self.product.has_discount)
        self.assertEqual(self.product.discount_percent, 0)

    def test_product_has_discount_with_compare_price(self):
        """Test remise avec prix barré"""
        self.product.compare_at_price = Decimal('225000.00')
        self.product.save()
        self.assertTrue(self.product.has_discount)
        self.assertGreater(self.product.discount_percent, 0)

    def test_product_discount_percent_calculation(self):
        """Test calcul du pourcentage de remise"""
        self.product.compare_at_price = Decimal('200000.00')
        self.product.save()
        expected = int(((Decimal('200000') - Decimal('185000')) / Decimal('200000')) * 100)
        self.assertEqual(self.product.discount_percent, expected)

    def test_product_is_new(self):
        """Test produit nouveau (créé récemment)"""
        self.assertTrue(self.product.is_new)

    def test_product_not_new_after_threshold(self):
        """Test produit plus nouveau après le seuil"""
        self.product.created_at = timezone.now() - timedelta(days=60)
        self.product.save()
        self.assertFalse(self.product.is_new)

    def test_product_str_representation(self):
        """Test représentation string du produit"""
        str_repr = str(self.product)
        self.assertIn('Sony WH-1000XM4', str_repr)

    def test_product_category_relationship(self):
        """Test relation avec catégorie"""
        self.assertEqual(self.product.category, self.category)
        self.assertIn(self.product, self.category.products.all())


class ProductStatusModelTests(TestCase):
    """Tests pour le modèle ProductStatus"""

    def setUp(self):
        self.category = Category.objects.create(name='Audio')
        self.product = Product.objects.create(
            name='Test Product',
            brand='Test',
            price=Decimal('100000.00'),
            characteristics='Test description',
            category=self.category,
        )
        self.status = self.product.status

    def test_status_creation(self):
        """Test création du statut produit"""
        self.assertEqual(self.status.view_count, 0)
        self.assertEqual(self.status.whatsapp_click_count, 0)
        self.assertFalse(self.status.is_featured)
        self.assertFalse(self.status.is_recommended)

    def test_increment_view_count(self):
        """Test incrémentation des vues"""
        initial_count = self.status.view_count
        self.status.increment_view_count()
        self.assertEqual(self.status.view_count, initial_count + 1)
        self.assertIsNotNone(self.status.last_viewed_at)

    def test_increment_whatsapp_count(self):
        """Test incrémentation des clics WhatsApp"""
        initial_count = self.status.whatsapp_click_count
        self.status.increment_whatsapp_count()
        self.assertEqual(self.status.whatsapp_click_count, initial_count + 1)

    def test_featured_flags(self):
        """Test flags vedette"""
        self.status.is_featured = True
        self.status.featured_score = 75.0
        self.status.save()
        self.status.refresh_from_db()
        self.assertTrue(self.status.is_featured)
        self.assertEqual(self.status.featured_score, 100.0)

    def test_force_featured_flag(self):
        """Test forçage vedette"""
        self.status.force_featured = True
        self.status.save()
        self.assertTrue(self.status.force_featured)

    def test_exclude_from_featured_flag(self):
        """Test exclusion des vedettes"""
        self.status.exclude_from_featured = True
        self.status.save()
        self.assertTrue(self.status.exclude_from_featured)


class ProductImageModelTests(TestCase):
    """Tests pour le modèle ProductImage"""

    def setUp(self):
        self.category = Category.objects.create(name='Test')
        self.product = Product.objects.create(
            name='Test Product',
            brand='Test',
            price=Decimal('100000.00'),
            characteristics='Test',
            category=self.category,
        )

    def test_image_creation(self):
        """Test création d'une image produit"""
        image_file = generate_image_file()
        img = ProductImage.objects.create(
            product=self.product,
            image=image_file,
            alt_text='Test image'
        )
        self.assertEqual(img.product, self.product)
        self.assertEqual(img.alt_text, 'Test image')

    def test_first_image_is_primary(self):
        """Test première image est principale"""
        image_file = generate_image_file()
        img = ProductImage.objects.create(
            product=self.product,
            image=image_file,
        )
        self.assertTrue(img.is_primary)

    def test_only_one_primary_image(self):
        """Test unicité de l'image principale"""
        img1 = ProductImage.objects.create(
            product=self.product,
            image=generate_image_file('img1.jpg'),
            is_primary=True
        )
        img2 = ProductImage.objects.create(
            product=self.product,
            image=generate_image_file('img2.jpg'),
            is_primary=True
        )
        img1.refresh_from_db()
        self.assertFalse(img1.is_primary)
        self.assertTrue(img2.is_primary)


class ServiceModelTests(TestCase):
    """Tests pour le modèle Service"""

    def test_service_creation(self):
        """Test création d'un service"""
        service = Service.objects.create(
            title='Livraison Rapide',
            description='Livraison sous 48h',
            order=1,
            is_active=True,
        )
        self.assertEqual(service.title, 'Livraison Rapide')
        self.assertTrue(service.is_active)
        self.assertIsNotNone(service.slug)

    def test_service_ordering(self):
        """Test ordre des services"""
        s1 = Service.objects.create(title='Service 1', description='', order=2)
        s2 = Service.objects.create(title='Service 2', description='', order=1)
        services = list(Service.objects.order_by('order'))
        self.assertEqual(services[0], s2)
        self.assertEqual(services[1], s1)


class SiteSettingsModelTests(TestCase):
    """Tests pour le modèle SiteSettings (Singleton)"""

    def test_singleton_creation(self):
        """Test création unique des paramètres"""
        settings1 = SiteSettings.load()
        settings2 = SiteSettings.load()
        self.assertEqual(settings1.pk, settings2.pk)

    def test_settings_update(self):
        """Test mise à jour des paramètres"""
        settings = SiteSettings.load()
        settings.company_name = 'NIASOTAC'
        settings.save()
        settings.refresh_from_db()
        self.assertEqual(settings.company_name, 'NIASOTAC')
