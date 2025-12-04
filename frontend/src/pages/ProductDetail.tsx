import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, ArrowLeft, ShoppingBag, Loader2 } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { ProductGallery } from '@/components/ProductGallery';
import { useProduct, useProducts, useTrackProductView } from '@/hooks/useProducts';
import { useSiteSettings } from '@/hooks/useSiteSettings';

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  // Utiliser l'API pour récupérer le produit
  const { data: product, isLoading, error } = useProduct(slug || '');
  const { data: siteSettings } = useSiteSettings();
  const trackProductView = useTrackProductView();
  
  // Tracker la vue du produit quand il se charge
  useEffect(() => {
    if (product && slug) {
      trackProductView(slug);
    }
  }, [product, slug, trackProductView]);
  
  // Récupérer les produits similaires (même catégorie)
  const categorySlug = product?.category_name ? product.category_name.toLowerCase().replace(/ /g, '-') : undefined;
  const { data: productsData } = useProducts({
    category: categorySlug
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <h2 className="text-2xl font-bold mb-4">Produit introuvable</h2>
        <p className="text-muted-foreground mb-6">Le produit que vous recherchez n'existe pas.</p>
        <Link to="/products">
          <Button>Retour aux produits</Button>
        </Link>
      </div>
    );
  }

  const relatedProducts = productsData?.results
    ?.filter(p => p.id !== product.id)
    .slice(0, 4) || [];

  const whatsappLink = product?.whatsapp_link;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Fil d'Ariane */}
      <div className="border-b bg-secondary/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Accueil</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-foreground transition-colors">Produits</Link>
            <span>/</span>
            {product.category_name && (
              <>
                <Link to={`/products?category=${product.category_name.toLowerCase().replace(/ /g, '-')}`} className="hover:text-foreground transition-colors">
                  {product.category_name}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-foreground">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Bouton Retour */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>

        {/* Détails du produit */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Section gauche - Galerie et badges */}
          <div className="space-y-4">
            {/* Badges en haut */}
            <div className="flex items-center gap-2 flex-wrap">
              {product.category_name && <Badge variant="secondary">{product.category_name}</Badge>}
              {product.is_featured && (
                <Badge className="bg-accent text-accent-foreground">Produit vedette</Badge>
              )}
              {product.is_in_stock ? (
                <Badge className="bg-green-500 text-white">En stock</Badge>
              ) : (
                <Badge variant="destructive">Rupture de stock</Badge>
              )}
            </div>
            {/* Galerie */}
            <ProductGallery
              mainImage={product.main_image || ''}
              gallery={product.images?.filter(img => !img.is_primary).map(img => img.image) || []}
              productName={product.name}
            />
          </div>

          {/* Informations */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>
              <p className="text-muted-foreground text-lg">{product.short_description}</p>
            </div>

            <div className="border-t border-b py-6">
              <div className="text-4xl font-bold text-primary mb-2">
                {product.final_price?.toLocaleString('fr-FR')} CFA
              </div>
              {product.has_discount && product.compare_at_price && (
                <div className="text-lg text-muted-foreground line-through mb-2">
                  {parseInt(product.compare_at_price).toLocaleString('fr-FR')} CFA
                </div>
              )}
              <p className="text-sm text-muted-foreground">Prix négociable via WhatsApp</p>
            </div>

            {/* Marque */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Marque</h3>
              <p className="text-muted-foreground">{product.brand}</p>
            </div>

            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a
                href={`${whatsappLink}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button size="lg" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Commander via WhatsApp
                </Button>
              </a>
            </div>

            {/* Caractéristiques */}
            {product.characteristics && (
              <div className="border rounded-lg p-4 space-y-3">
                <h3 className="font-semibold text-lg">Caractéristiques</h3>
                <div className="space-y-2">
                  {product.characteristics.split('\n').map((line, index) => (
                    line.trim() && (
                      <div key={index} className="flex items-start gap-3">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <p className="text-muted-foreground text-sm">{line.trim()}</p>
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}

            {/* Informations supplémentaires */}
            <div className="bg-accent/10 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-accent" />
                <span className="font-medium">Pourquoi acheter chez nous ?</span>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1 ml-7">
                <li>• Produits vérifiés de magasins partenaires de confiance</li>
                <li>• Prix compétitifs avec options de négociation</li>
                <li>• Livraison rapide à travers le Bénin</li>
                <li>• Support 24/7 via WhatsApp</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Produits similaires */}
        {relatedProducts.length > 0 && (
          <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-8">Produits similaires</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
