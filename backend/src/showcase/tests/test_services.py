"""
Tests pour les services métier
"""
from decimal import Decimal
from django.test import TestCase
from django.utils import timezone
from datetime import timedelta

from ..models import Category, Product, ProductStatus, Promotion
from ..services.scoring_service import ScoringService
from ..services.promotion_service import PromotionService


class ScoringServiceTests(TestCase):
    """Tests pour le service de scoring"""

    def setUp(self):
        self.category = Category.objects.create(name='Audio')
        self.product = Product.objects.create(
            name='Test Product',
            brand='Test',
            price=Decimal('100000.00'),
            characteristics='Test description',
            category=self.category,
            is_in_stock=True,
        )
        self.status = self.product.status

    def test_featured_score_excluded(self):
        """Test score vedette avec exclusion"""
        self.status.exclude_from_featured = True
        self.status.save()
        is_featured, score = ScoringService.calculate_featured_score(self.status)
        self.assertFalse(is_featured)
        self.assertEqual(score, Decimal('0.0'))

    def test_featured_score_forced(self):
        """Test score vedette forcé"""
        self.status.force_featured = True
        self.status.save()
        is_featured, score = ScoringService.calculate_featured_score(self.status)
        self.assertTrue(is_featured)
        self.assertEqual(score, Decimal('100.0'))

    def test_featured_score_calculation(self):
        """Test calcul du score vedette"""
        is_featured, score = ScoringService.calculate_featured_score(self.status)
        self.assertIsInstance(score, Decimal)
        self.assertGreaterEqual(score, Decimal('0'))

    def test_recommendation_score_excluded(self):
        """Test score recommandation avec exclusion"""
        self.status.exclude_from_recommended = True
        self.status.save()
        is_recommended, score = ScoringService.calculate_recommendation_score(self.status)
        self.assertFalse(is_recommended)
        self.assertEqual(score, Decimal('0.0'))

    def test_recommendation_score_forced(self):
        """Test score recommandation forcé"""
        self.status.force_recommended = True
        self.status.save()
        is_recommended, score = ScoringService.calculate_recommendation_score(self.status)
        self.assertTrue(is_recommended)
        self.assertEqual(score, Decimal('100.0'))

    def test_recommendation_score_calculation(self):
        """Test calcul du score recommandation"""
        is_recommended, score = ScoringService.calculate_recommendation_score(self.status)
        self.assertIsInstance(score, Decimal)
        self.assertGreaterEqual(score, Decimal('0'))

    def test_views_affect_featured_score(self):
        """Test impact des vues sur le score"""
        initial_score = ScoringService.calculate_featured_score(self.status)[1]
        self.status.view_count = 100
        self.status.last_viewed_at = timezone.now()
        self.status.save()
        new_score = ScoringService.calculate_featured_score(self.status)[1]
        self.assertGreaterEqual(new_score, initial_score)

    def test_stock_affects_featured_score(self):
        """Test impact du stock sur le score"""
        in_stock_score = ScoringService.calculate_featured_score(self.status)[1]
        self.product.is_in_stock = False
        self.product.save()
        out_of_stock_score = ScoringService.calculate_featured_score(self.status)[1]
        self.assertGreater(in_stock_score, out_of_stock_score)


class PromotionServiceTests(TestCase):
    """Tests pour le service de promotions"""

    def setUp(self):
        self.category = Category.objects.create(name='Test')
        self.product = Product.objects.create(
            name='Test Product',
            brand='Test',
            price=Decimal('100000.00'),
            characteristics='Test',
            category=self.category,
        )

    def test_no_promotions(self):
        """Test sans promotions actives"""
        promos = PromotionService.get_applicable_promotions(self.product)
        self.assertEqual(len(promos), 0)

    def test_price_without_promotions(self):
        """Test prix sans promotions"""
        discount, final = PromotionService.calculate_price_with_promotions(self.product)
        self.assertEqual(discount, Decimal('0.00'))
        self.assertEqual(final, self.product.price)

    def test_get_best_promotion_no_promos(self):
        """Test meilleure promo sans promotions"""
        best = PromotionService.get_best_promotion(self.product)
        self.assertIsNone(best)
