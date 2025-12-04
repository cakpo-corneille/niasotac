from django.core.management.base import BaseCommand
from django.core.files import File
from django.utils import timezone
from pathlib import Path
from decimal import Decimal
import random


class Command(BaseCommand):
    help = 'Peuple la base de données avec des produits tech réalistes pour le Bénin'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Supprime toutes les données existantes avant le peuplement',
        )

    def handle(self, *args, **options):
        from showcase.models import (
            Category, Product, ProductImage, ProductStatus,
            Service, SiteSettings
        )

        self.stdout.write(self.style.SUCCESS('📦 Début du peuplement des données NIASOTAC...'))

        assets_root = Path(__file__).resolve().parent.parent.parent.parent.parent.parent / 'assets' / 'products'

        if options['clear']:
            ProductImage.objects.all().delete()
            ProductStatus.objects.all().delete()
            Product.objects.all().delete()
            Category.objects.all().delete()
            Service.objects.all().delete()
            self.stdout.write(self.style.WARNING('🧹 Anciennes données supprimées.'))

        categories_data = {
            'Ordinateurs': {
                'icon': 'fa-laptop',
                'subcategories': [
                    'Ordinateurs portables',
                    'Ordinateurs de bureau',
                    'Mini PC',
                    'Stations de travail'
                ]
            },
            'Composants PC': {
                'icon': 'fa-microchip',
                'subcategories': [
                    'Processeurs',
                    'Cartes mères',
                    'Mémoire RAM',
                    'Cartes graphiques',
                    'Stockage SSD/HDD'
                ]
            },
            'Imprimantes': {
                'icon': 'fa-print',
                'subcategories': [
                    'Imprimantes laser',
                    'Imprimantes jet d\'encre',
                    'Imprimantes multifonctions',
                    'Consommables'
                ]
            },
            'Accessoires': {
                'icon': 'fa-keyboard',
                'subcategories': [
                    'Claviers et souris',
                    'Webcams et microphones',
                    'Casques audio',
                    'Câbles et adaptateurs',
                    'Sacs et housses'
                ]
            },
            'Réseau': {
                'icon': 'fa-wifi',
                'subcategories': [
                    'Routeurs WiFi',
                    'Switches',
                    'Points d\'accès',
                    'Câbles réseau'
                ]
            }
        }

        products_data = [
            {
                'category': 'Ordinateurs portables',
                'name': 'HP Pavilion 15',
                'brand': 'HP',
                'price': Decimal('450000'),
                'compare_at_price': Decimal('520000'),
                'description': 'Ordinateur portable performant équipé d\'un processeur Intel Core i5 de 11ème génération, 8Go de RAM DDR4 et un SSD de 512Go. Écran Full HD 15.6 pouces anti-reflet. Parfait pour le travail et le multimédia.',
                'short_description': 'Intel Core i5, 8Go RAM, 512Go SSD, écran 15.6" FHD',
                'image': 'hp_pavilion_15_lapto_82f27639_MvO73jM.jpg',
                'is_featured': True,
                'is_recommended': True,
            },
            {
                'category': 'Ordinateurs portables',
                'name': 'Dell Latitude 5420',
                'brand': 'Dell',
                'price': Decimal('520000'),
                'compare_at_price': Decimal('620000'),
                'description': 'PC portable professionnel Dell Latitude avec Intel Core i7, 16Go de RAM et SSD 1To. Design robuste et élégant, idéal pour les professionnels exigeants. Clavier rétroéclairé et autonomie longue durée.',
                'short_description': 'Intel Core i7, 16Go RAM, 1To SSD, écran 14" FHD',
                'image': 'dell_latitude_busine_0709ca7a_gje4ZH6.jpg',
                'is_featured': True,
                'is_recommended': False,
            },
            {
                'category': 'Ordinateurs portables',
                'name': 'ASUS VivoBook 15',
                'brand': 'ASUS',
                'price': Decimal('380000'),
                'compare_at_price': None,
                'description': 'Ordinateur portable ASUS VivoBook avec un design moderne et léger. Processeur AMD Ryzen 5, 8Go RAM, 256Go SSD. Écran NanoEdge Full HD pour une immersion totale.',
                'short_description': 'AMD Ryzen 5, 8Go RAM, 256Go SSD, écran 15.6" FHD',
                'image': 'asus_vivobook_laptop_bb959290_OzmeuD0.jpg',
                'is_featured': False,
                'is_recommended': True,
            },
            {
                'category': 'Ordinateurs portables',
                'name': 'Lenovo ThinkPad E14',
                'brand': 'Lenovo',
                'price': Decimal('485000'),
                'compare_at_price': Decimal('550000'),
                'description': 'ThinkPad E14 - la fiabilité légendaire ThinkPad à un prix accessible. Intel Core i5, 8Go RAM, 512Go SSD. Clavier ergonomique ThinkPad et TrackPoint. Construction solide certifiée MIL-SPEC.',
                'short_description': 'Intel Core i5, 8Go RAM, 512Go SSD, écran 14" FHD',
                'image': 'lenovo_thinkpad_lapt_488f1b87_K3wcuql.jpg',
                'is_featured': True,
                'is_recommended': True,
            },
            {
                'category': 'Ordinateurs de bureau',
                'name': 'Dell OptiPlex 3090',
                'brand': 'Dell',
                'price': Decimal('420000'),
                'compare_at_price': None,
                'description': 'PC de bureau Dell OptiPlex compact et puissant. Intel Core i5 de 10ème génération, 8Go DDR4, SSD 256Go. Idéal pour les entreprises avec ses fonctionnalités de sécurité avancées.',
                'short_description': 'Intel Core i5, 8Go RAM, 256Go SSD, format compact',
                'image': 'dell_desktop_compute_8b61b09d_3vuptIO.jpg',
                'is_featured': False,
                'is_recommended': True,
            },
            {
                'category': 'Ordinateurs de bureau',
                'name': 'Lenovo ThinkCentre M70q',
                'brand': 'Lenovo',
                'price': Decimal('395000'),
                'compare_at_price': Decimal('450000'),
                'description': 'Mini PC Lenovo ThinkCentre ultra-compact (1 litre). Intel Core i5, 8Go RAM, 256Go NVMe. Parfait pour les espaces de travail réduits sans compromis sur les performances.',
                'short_description': 'Intel Core i5, 8Go RAM, 256Go SSD, format mini 1L',
                'image': 'lenovo_desktop_compu_183043e8_hcbvLEi.jpg',
                'is_featured': True,
                'is_recommended': False,
            },
            {
                'category': 'Mini PC',
                'name': 'Intel NUC 11',
                'brand': 'Intel',
                'price': Decimal('320000'),
                'compare_at_price': None,
                'description': 'Intel NUC 11 - le PC de poche puissant. Intel Core i5-1135G7, performances graphiques Iris Xe. Format ultra-compact pour un bureau minimaliste ou un media center.',
                'short_description': 'Intel Core i5, format ultra-compact NUC',
                'image': 'intel_nuc_mini_pc_4b19d37b_Vgs4Iij.jpg',
                'is_featured': False,
                'is_recommended': True,
            },
            {
                'category': 'Mini PC',
                'name': 'ASUS Mini PC PN51',
                'brand': 'ASUS',
                'price': Decimal('285000'),
                'compare_at_price': Decimal('320000'),
                'description': 'Mini PC ASUS compact avec AMD Ryzen 5 5500U. Connectivité complète: USB-C, HDMI 2.0, DisplayPort. Silencieux et économe en énergie. Parfait pour le bureau ou le salon.',
                'short_description': 'AMD Ryzen 5, format compact, triple affichage',
                'image': 'asus_mini_pc_compact_0bc5e66f_juuQFPn.jpg',
                'is_featured': True,
                'is_recommended': True,
            },
            {
                'category': 'Processeurs',
                'name': 'Intel Core i7-12700K',
                'brand': 'Intel',
                'price': Decimal('245000'),
                'compare_at_price': Decimal('280000'),
                'description': 'Processeur Intel Core i7 de 12ème génération (Alder Lake). 12 cœurs (8P+4E), 20 threads, jusqu\'à 5.0 GHz. Architecture hybride pour des performances optimales en gaming et productivité.',
                'short_description': '12 cœurs, 20 threads, jusqu\'à 5.0 GHz, LGA 1700',
                'image': 'intel_core_processor_db7760b1_CtbU9SY.jpg',
                'is_featured': True,
                'is_recommended': True,
            },
            {
                'category': 'Processeurs',
                'name': 'AMD Ryzen 7 5800X',
                'brand': 'AMD',
                'price': Decimal('225000'),
                'compare_at_price': None,
                'description': 'Processeur AMD Ryzen 7 5800X avec architecture Zen 3. 8 cœurs, 16 threads, fréquence boost jusqu\'à 4.7 GHz. Excellentes performances en jeu et en création de contenu.',
                'short_description': '8 cœurs, 16 threads, jusqu\'à 4.7 GHz, AM4',
                'image': 'amd_ryzen_processor__7da8f709_NZSyc3D.jpg',
                'is_featured': False,
                'is_recommended': True,
            },
            {
                'category': 'Cartes mères',
                'name': 'ASUS ROG Strix B550-F',
                'brand': 'ASUS',
                'price': Decimal('135000'),
                'compare_at_price': Decimal('155000'),
                'description': 'Carte mère gaming ASUS ROG Strix B550-F pour AMD AM4. PCIe 4.0, DDR4-4400+, WiFi 6, USB 3.2 Gen 2. Alimentation robuste 12+2 phases pour overclock stable.',
                'short_description': 'AMD AM4, PCIe 4.0, WiFi 6, éclairage RGB',
                'image': 'computer_motherboard_1dc30bff.jpg',
                'is_featured': False,
                'is_recommended': True,
            },
            {
                'category': 'Cartes mères',
                'name': 'MSI MAG B660 Tomahawk',
                'brand': 'MSI',
                'price': Decimal('125000'),
                'compare_at_price': None,
                'description': 'Carte mère MSI pour Intel 12ème génération. Socket LGA 1700, DDR5 ready, PCIe 5.0, 2.5G LAN. Design militaire robuste et refroidissement optimisé.',
                'short_description': 'Intel LGA 1700, DDR5, PCIe 5.0, 2.5G LAN',
                'image': 'computer_motherboard_1dc30bff_ODBEISi.jpg',
                'is_featured': True,
                'is_recommended': False,
            },
            {
                'category': 'Mémoire RAM',
                'name': 'Corsair Vengeance RGB 32Go',
                'brand': 'Corsair',
                'price': Decimal('95000'),
                'compare_at_price': Decimal('115000'),
                'description': 'Kit mémoire Corsair Vengeance RGB Pro 32Go (2x16Go) DDR4-3600MHz. Éclairage RGB dynamique, profil XMP 2.0 pour overclock automatique. Dissipateur thermique en aluminium.',
                'short_description': '2x16Go DDR4-3600MHz, RGB, XMP 2.0',
                'image': 'ddr4_ram_memory_modu_c1a3b93d_8226hND.jpg',
                'is_featured': True,
                'is_recommended': True,
            },
            {
                'category': 'Mémoire RAM',
                'name': 'Kingston Fury Beast 16Go',
                'brand': 'Kingston',
                'price': Decimal('48000'),
                'compare_at_price': None,
                'description': 'Kit mémoire Kingston Fury Beast 16Go (2x8Go) DDR4-3200MHz. Dissipateur thermique stylisé, profil XMP. Fiabilité et performances pour le gaming et le multitâche.',
                'short_description': '2x8Go DDR4-3200MHz, dissipateur thermique',
                'image': 'ddr4_ram_memory_modu_c1a3b93d_fJT7qDc.jpg',
                'is_featured': False,
                'is_recommended': True,
            },
            {
                'category': 'Imprimantes laser',
                'name': 'HP LaserJet Pro M404dn',
                'brand': 'HP',
                'price': Decimal('185000'),
                'compare_at_price': Decimal('220000'),
                'description': 'Imprimante laser monochrome HP LaserJet Pro haute performance. Jusqu\'à 40 ppm, recto-verso automatique, réseau Ethernet. Première page en moins de 6 secondes.',
                'short_description': 'Laser mono, 40 ppm, recto-verso auto, réseau',
                'image': 'hp_laserjet_printer__2d6c2ee1_coaArrQ.jpg',
                'is_featured': True,
                'is_recommended': True,
            },
            {
                'category': 'Imprimantes laser',
                'name': 'Brother HL-L2350DW',
                'brand': 'Brother',
                'price': Decimal('125000'),
                'compare_at_price': None,
                'description': 'Imprimante laser compacte Brother avec WiFi intégré. 32 ppm, recto-verso automatique, toner économique. Idéale pour les petits bureaux et le télétravail.',
                'short_description': 'Laser mono, 32 ppm, WiFi, recto-verso auto',
                'image': 'brother_laser_printe_53edb6e9_NrYkxBz.jpg',
                'is_featured': False,
                'is_recommended': True,
            },
            {
                'category': 'Imprimantes laser',
                'name': 'Canon imageCLASS LBP226dw',
                'brand': 'Canon',
                'price': Decimal('165000'),
                'compare_at_price': Decimal('195000'),
                'description': 'Imprimante laser Canon professionnelle. 38 ppm, WiFi Direct, impression mobile, recto-verso automatique. Bac 250 feuilles extensible.',
                'short_description': 'Laser mono, 38 ppm, WiFi Direct, mobile print',
                'image': 'canon_laser_printer_b84a0652_i3WTV9c.jpg',
                'is_featured': True,
                'is_recommended': False,
            },
            {
                'category': 'Imprimantes jet d\'encre',
                'name': 'Canon PIXMA G3420',
                'brand': 'Canon',
                'price': Decimal('145000'),
                'compare_at_price': None,
                'description': 'Imprimante multifonction Canon PIXMA série G à réservoirs d\'encre rechargeables. Économique: jusqu\'à 7700 pages couleur par bouteille. WiFi, scanner, copie.',
                'short_description': 'Jet d\'encre MegaTank, scan/copie, WiFi',
                'image': 'canon_pixma_inkjet_p_8c86798b_EbWOAjZ.jpg',
                'is_featured': True,
                'is_recommended': True,
            },
            {
                'category': 'Imprimantes jet d\'encre',
                'name': 'Epson EcoTank L3250',
                'brand': 'Epson',
                'price': Decimal('135000'),
                'compare_at_price': Decimal('160000'),
                'description': 'Imprimante EcoTank Epson avec réservoirs d\'encre haute capacité. Coût par page ultra-bas. Impression, scan, copie. WiFi et WiFi Direct intégrés.',
                'short_description': 'EcoTank, scan/copie, WiFi, coût ultra-bas',
                'image': 'epson_ecotank_inkjet_41afd232_1eCRfq1.jpg',
                'is_featured': False,
                'is_recommended': True,
            },
            {
                'category': 'Imprimantes multifonctions',
                'name': 'HP OfficeJet Pro 9015e',
                'brand': 'HP',
                'price': Decimal('225000'),
                'compare_at_price': Decimal('275000'),
                'description': 'Multifonction jet d\'encre HP OfficeJet Pro tout-en-un. Impression, scan, copie, fax. Recto-verso auto, chargeur auto de documents 35 feuilles. HP+ et Instant Ink compatible.',
                'short_description': 'Jet d\'encre 4-en-1, recto-verso, ADF, HP+',
                'image': 'hp_officejet_pro_mul_318ec5c9_eHbISxf.jpg',
                'is_featured': True,
                'is_recommended': True,
            },
            {
                'category': 'Imprimantes multifonctions',
                'name': 'Epson WorkForce Pro WF-4820',
                'brand': 'Epson',
                'price': Decimal('195000'),
                'compare_at_price': None,
                'description': 'Multifonction Epson WorkForce Pro pour PME. Impression, scan, copie, fax. Cartouches haute capacité, ADF 35 pages, écran tactile 4.3 pouces.',
                'short_description': 'Jet d\'encre 4-en-1, ADF, écran tactile',
                'image': 'epson_workforce_mult_3e38c02c_vROgjt1.jpg',
                'is_featured': False,
                'is_recommended': True,
            },
            {
                'category': 'Imprimantes multifonctions',
                'name': 'HP DeskJet 4155e',
                'brand': 'HP',
                'price': Decimal('85000'),
                'compare_at_price': Decimal('95000'),
                'description': 'Multifonction HP DeskJet abordable pour la maison. Impression, scan, copie. WiFi, HP Smart App, compatible HP+. Idéale pour les étudiants et familles.',
                'short_description': 'Jet d\'encre 3-en-1, WiFi, HP Smart App',
                'image': 'hp_deskjet_all-in-on_daace557_AHS1sem.jpg',
                'is_featured': False,
                'is_recommended': False,
            },
            {
                'category': 'Claviers et souris',
                'name': 'Logitech MK470 Slim Combo',
                'brand': 'Logitech',
                'price': Decimal('45000'),
                'compare_at_price': None,
                'description': 'Ensemble clavier et souris sans fil Logitech MK470 au design fin et élégant. Touches silencieuses, souris compacte, récepteur USB Unifying. Autonomie jusqu\'à 18 mois.',
                'short_description': 'Clavier + souris sans fil, slim, silencieux',
                'image': 'logitech_wireless_ke_2e6f40ae_0N8uNkq.jpg',
                'is_featured': True,
                'is_recommended': True,
            },
            {
                'category': 'Claviers et souris',
                'name': 'Corsair K55 RGB Pro Gaming',
                'brand': 'Corsair',
                'price': Decimal('55000'),
                'compare_at_price': Decimal('65000'),
                'description': 'Clavier gaming Corsair K55 RGB Pro avec rétroéclairage RGB dynamique. 6 touches macro programmables, repose-poignet détachable, résistant aux éclaboussures.',
                'short_description': 'Clavier gaming RGB, touches macro, repose-poignet',
                'image': 'corsair_rgb_gaming_k_5c8334fe_aaYxYQ9.jpg',
                'is_featured': False,
                'is_recommended': True,
            },
            {
                'category': 'Casques audio',
                'name': 'Sony WH-1000XM4',
                'brand': 'Sony',
                'price': Decimal('185000'),
                'compare_at_price': Decimal('225000'),
                'description': 'Casque Bluetooth Sony WH-1000XM4 avec réduction de bruit active leader du marché. 30 heures d\'autonomie, audio haute résolution LDAC, confort premium pour longs trajets.',
                'short_description': 'Bluetooth ANC, 30h autonomie, LDAC, confort premium',
                'image': 'sony_wh-1000xm4_wire_082c1f72_Ga0IwON.jpg',
                'is_featured': True,
                'is_recommended': True,
            },
            {
                'category': 'Casques audio',
                'name': 'HyperX Cloud II Gaming',
                'brand': 'HyperX',
                'price': Decimal('75000'),
                'compare_at_price': None,
                'description': 'Casque gaming HyperX Cloud II avec son surround 7.1 virtuel. Micro détachable avec annulation de bruit, coussinets à mémoire de forme, construction en aluminium.',
                'short_description': 'Gaming 7.1, micro anti-bruit, aluminium',
                'image': 'hyperx_cloud_gaming__c0d47669_Ot8Vm7a.jpg',
                'is_featured': False,
                'is_recommended': True,
            },
            {
                'category': 'Casques audio',
                'name': 'Logitech G Pro X',
                'brand': 'Logitech',
                'price': Decimal('95000'),
                'compare_at_price': Decimal('115000'),
                'description': 'Casque gaming professionnel Logitech G Pro X. Technologie Blue VO!CE pour un son de micro studio, DTS Headphone:X 2.0, coussinets hybrides cuir/velours.',
                'short_description': 'Gaming Pro, Blue VO!CE, DTS:X 2.0',
                'image': 'logitech_gaming_head_899e1d47_YFVdQ6L.jpg',
                'is_featured': True,
                'is_recommended': False,
            },
            {
                'category': 'Webcams et microphones',
                'name': 'Logitech C920 HD Pro',
                'brand': 'Logitech',
                'price': Decimal('65000'),
                'compare_at_price': None,
                'description': 'Webcam Logitech C920 HD Pro pour visioconférences et streaming. Full HD 1080p à 30 fps, autofocus, correction automatique de lumière, 2 micros stéréo intégrés.',
                'short_description': 'Full HD 1080p, autofocus, stéréo',
                'image': 'logitech_c920_hd_pro_9040c99e_1iYLLbL.jpg',
                'is_featured': True,
                'is_recommended': True,
            },
            {
                'category': 'Webcams et microphones',
                'name': 'Blue Yeti USB',
                'brand': 'Blue',
                'price': Decimal('95000'),
                'compare_at_price': Decimal('115000'),
                'description': 'Microphone USB Blue Yeti professionnel pour podcasts, streaming et enregistrement. 4 modes de captation (cardioïde, omnidirectionnel, stéréo, bidirectionnel), contrôle gain intégré.',
                'short_description': 'Micro USB Pro, 4 modes, contrôle gain',
                'image': 'blue_yeti_usb_microp_c8d64e04_RVsMUbd.jpg',
                'is_featured': True,
                'is_recommended': True,
            },
            {
                'category': 'Webcams et microphones',
                'name': 'Razer Kiyo Streaming Cam',
                'brand': 'Razer',
                'price': Decimal('85000'),
                'compare_at_price': None,
                'description': 'Webcam Razer Kiyo avec anneau lumineux intégré pour un éclairage parfait. Full HD 1080p 30fps ou 720p 60fps, idéale pour le streaming et les appels vidéo professionnels.',
                'short_description': 'Full HD, anneau lumineux, streaming',
                'image': 'razer_kiyo_streaming_837713af_Dqx3ky4.jpg',
                'is_featured': False,
                'is_recommended': True,
            },
        ]

        services_data = [
            {
                'title': 'Conseil & Accompagnement',
                'description': 'Notre équipe d\'experts vous guide dans le choix de votre équipement informatique selon vos besoins spécifiques et votre budget.',
                'order': 1,
            },
            {
                'title': 'Livraison Rapide',
                'description': 'Livraison sécurisée partout au Bénin. Cotonou en 24-48h, autres villes en 3-5 jours ouvrés.',
                'order': 2,
            },
            {
                'title': 'Service Après-Vente',
                'description': 'Garantie constructeur sur tous nos produits. Support technique disponible pour vous accompagner.',
                'order': 3,
            },
            {
                'title': 'Prix Compétitifs',
                'description': 'Nous négocions directement avec les fournisseurs pour vous offrir les meilleurs prix du marché béninois.',
                'order': 4,
            },
        ]

        category_map = {}
        for parent_name, data in categories_data.items():
            parent, _ = Category.objects.get_or_create(
                name=parent_name,
                defaults={'icon_file': None}
            )
            category_map[parent_name] = parent
            self.stdout.write(self.style.SUCCESS(f'✓ Catégorie: {parent_name}'))

            for sub_name in data['subcategories']:
                sub, _ = Category.objects.get_or_create(
                    name=sub_name,
                    defaults={'parent': parent, 'icon_file': None}
                )
                category_map[sub_name] = sub
                self.stdout.write(f'  └─ {sub_name}')

        for item in products_data:
            category = category_map.get(item['category'])
            if not category:
                self.stdout.write(self.style.WARNING(f'⚠ Catégorie introuvable: {item["category"]}'))
                continue

            product, created = Product.objects.get_or_create(
                name=item['name'],
                defaults={
                    'brand': item['brand'],
                    'price': item['price'],
                    'compare_at_price': item.get('compare_at_price'),
                    'description': item['description'],
                    'short_description': item.get('short_description', ''),
                    'category': category,
                    'is_in_stock': random.choice([True, True, True, False]),
                    'is_active': True,
                }
            )

            if created:
                image_path = assets_root / item['image']
                if image_path.exists():
                    with open(image_path, 'rb') as f:
                        img = ProductImage.objects.create(
                            product=product,
                            is_primary=True,
                            alt_text=item['name']
                        )
                        img.image.save(item['image'], File(f), save=True)
                else:
                    self.stdout.write(self.style.WARNING(f'  ⚠ Image non trouvée: {item["image"]}'))

                status, _ = ProductStatus.objects.get_or_create(
                    product=product,
                    defaults={
                        'is_featured': item.get('is_featured', False),
                        'is_recommended': item.get('is_recommended', False),
                        'featured_score': random.uniform(0.5, 1.0) if item.get('is_featured') else 0,
                        'recommendation_score': random.uniform(0.5, 1.0) if item.get('is_recommended') else 0,
                    }
                )

                self.stdout.write(f'  ✓ {product.name} - {product.price} FCFA')
            else:
                self.stdout.write(f'  → {product.name} (existant)')

        for service_data in services_data:
            service, created = Service.objects.get_or_create(
                title=service_data['title'],
                defaults={
                    'description': service_data['description'],
                    'order': service_data['order'],
                    'is_active': True,
                }
            )
            if created:
                self.stdout.write(f'✓ Service: {service.title}')

        settings, _ = SiteSettings.objects.get_or_create(
            id=1,
            defaults={
                'company_name': 'NIASOTAC',
                'company_description': 'Votre partenaire technologique de confiance au Bénin. Nous proposons une large gamme de produits informatiques de qualité: ordinateurs, composants, imprimantes et accessoires.',
                'whatsapp_number': '+22990000000',
                'contact_email': 'contact@niasotac.com',
                'contact_phone': '+229 90 00 00 00',
                'contact_address': 'Cotonou, Bénin',
            }
        )

        total_cats = Category.objects.count()
        total_prods = Product.objects.count()
        total_services = Service.objects.count()
        featured_count = ProductStatus.objects.filter(is_featured=True).count()

        self.stdout.write(self.style.SUCCESS('\n' + '=' * 60))
        self.stdout.write(self.style.SUCCESS(f'✓ {total_cats} catégories'))
        self.stdout.write(self.style.SUCCESS(f'✓ {total_prods} produits ({featured_count} vedettes)'))
        self.stdout.write(self.style.SUCCESS(f'✓ {total_services} services'))
        self.stdout.write(self.style.SUCCESS('=' * 60))
        self.stdout.write(self.style.SUCCESS('✅ Données NIASOTAC créées avec succès!'))
