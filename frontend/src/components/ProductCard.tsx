import { Link } from 'react-router-dom';
import { Product } from '@/hooks/useProducts';
import { getCategoryIcon } from '@/lib/categoryIcons';

interface ProductCardProps {
  product: Product;
  showCategoryBadge?: boolean;
  badgeMode?: 'featured' | 'new' | 'full'; // featured: only "À la une", new: only "Nouveau", full: category icon + badge
}

export const ProductCard = ({ product, showCategoryBadge = true, badgeMode = 'full' }: ProductCardProps) => {
  const calculateDiscount = () => {
    if (product.display_price && product.price) {
      const original = parseFloat(String(product.price));
      const final = parseFloat(String(product.display_price));
      if (original > final) {
        return Math.round(((original - final) / original) * 100);
      }
    }
    return 0;
  };

  const discount = calculateDiscount();
  const displayPrice = product.display_price || product.price;
  const CategoryIcon = getCategoryIcon(product.category_name?.toLowerCase() || '');

  const getStatusBadge = () => {
    // Vérifier si c'est un nouveau produit (créé dans les 30 derniers jours)
    const isNew = product.created_at ? 
      (new Date().getTime() - new Date(product.created_at).getTime()) < (30 * 24 * 60 * 60 * 1000) 
      : false;
    
    // Mode "featured": afficher seulement "À la une"
    if (badgeMode === 'featured') {
      if (product.featured || product.is_featured) return { text: 'À la une', color: 'bg-accent' };
      return null;
    }
    
    // Mode "new": afficher seulement "Nouveau"
    if (badgeMode === 'new') {
      if (isNew) return { text: 'Nouveau', color: 'bg-blue-500' };
      return null;
    }
    
    // Mode "full": priorité Nouveau > Recommandé > À la une
    if (isNew) return { text: 'Nouveau', color: 'bg-blue-500' };
    if ((product as any).is_recommended) return { text: 'Recommandé', color: 'bg-purple-500' };
    if (product.featured || product.is_featured) return { text: 'À la une', color: 'bg-accent' };
    return null;
  };

  const statusBadge = getStatusBadge();

  return (
    <Link to={`/products/${product.slug}`} data-testid={`card-product-${product.id}`} className="w-full">
      <div className="group relative overflow-hidden rounded-lg bg-card transition-all duration-300 hover:shadow-lg flex flex-col h-full">
        {/* Image - dominante - optimized loading */}
        <div className="relative overflow-hidden bg-secondary flex-shrink-0 aspect-square w-full">
          <img
            src={product.main_image || product.image}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 will-change-transform"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder.svg';
            }}
          />

          {/* Badges overlay - max 3, compact */}
          <div className="absolute top-2 left-2 right-2 flex flex-wrap gap-1">
            {/* Badge catégorie avec icône */}
            {showCategoryBadge && product.category_name && (
              <div className="bg-black/60 text-white px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1 backdrop-blur-sm">
                <CategoryIcon className="h-3 w-3" />
                <span className="line-clamp-1 hidden sm:inline">{product.category_name}</span>
              </div>
            )}

            {/* Badge statut */}
            {statusBadge && (
              <div className={`${statusBadge.color} text-white px-2 py-0.5 rounded text-xs font-bold backdrop-blur-sm`}>
                {statusBadge.text}
              </div>
            )}

            {/* Badge réduction */}
            {discount > 0 && (
              <div className="bg-red-500 text-white px-2 py-0.5 rounded text-xs font-bold backdrop-blur-sm">
                -{discount}%
              </div>
            )}
          </div>

          {/* Rupture */}
          {!(product.is_in_stock ?? product.in_stock) && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
              <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold">Rupture</span>
            </div>
          )}
        </div>

        {/* Contenu compact */}
        <div className="flex-1 p-2 flex flex-col gap-1">
          <h3 className="font-semibold text-xs sm:text-sm line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {/* Prix */}
          <div className="mt-auto space-y-0.5">
            <div className="text-base sm:text-lg font-bold text-primary">
              {parseFloat(String(displayPrice)).toLocaleString('fr-FR')} FCFA
            </div>
            {discount > 0 && (
              <div className="text-xs text-muted-foreground line-through">
                {parseFloat(String(product.price)).toLocaleString('fr-FR')} FCFA
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};
