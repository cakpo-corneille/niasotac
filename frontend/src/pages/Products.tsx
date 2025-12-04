/**
 * Page des produits - NIASOTAC TECHNOLOGIE (VERSION OPTIMISÉE)
 * Features:
 * - Barre de recherche sticky
 * - Filtres sidebar (desktop) / modal (mobile)
 * - Détection scroll intelligente pour recommandations (12-15 produits aléatoires)
 * - Skeleton loaders professionnels
 * - Animations fade-in et hover states
 * - CategoryBand sticky en bas
 * - Responsive parfait
 */

import { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '@/components/ProductCard';
import { CategoryBand } from '@/components/CategoryBand';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Loader2, X, SlidersHorizontal } from 'lucide-react';
import { Card } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useProducts, useRecommendedProducts } from '@/hooks/useProducts';
import { useMainCategories, useAllCategories } from '@/hooks/useCategories';

// ============================================================================
// SKELETON LOADER COMPONENT
// ============================================================================
const ProductCardSkeleton = () => (
  <div className="bg-card rounded-lg border overflow-hidden animate-pulse">
    <div className="aspect-square bg-muted" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-muted rounded w-3/4" />
      <div className="h-3 bg-muted rounded w-1/2" />
      <div className="h-5 bg-muted rounded w-1/3" />
    </div>
  </div>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const gridRef = useRef<HTMLDivElement>(null);
  
  // États des filtres
  const [filters, setFilters] = useState({
    inStockOnly: searchParams.get('in_stock') === 'true',
    promosOnly: searchParams.get('has_discount') === 'true',
    featuredOnly: searchParams.get('is_featured') === 'true',
    minPrice: searchParams.get('min_price') || '',
    maxPrice: searchParams.get('max_price') || '',
    selectedBrands: searchParams.get('brands')?.split(',').filter(Boolean) || [],
  });
  
  const selectedCategory = searchParams.get('category') || '';


  // Chargement des données
  const { data: mainCategoriesData } = useMainCategories();
  const mainCategories = Array.isArray(mainCategoriesData) ? mainCategoriesData : [];
  
  const { data: allCategoriesData } = useAllCategories();
  const allCategories = Array.isArray(allCategoriesData) ? allCategoriesData : [];
  
  // Construction des paramètres API dynamiques
  const apiParams = useMemo(() => {
    const params: any = {};
    if (searchQuery) params.search = searchQuery;
    if (selectedCategory) params.category = selectedCategory;
    if (filters.inStockOnly) params.is_in_stock = true;
    if (filters.promosOnly) params.has_discount = true;
    if (filters.featuredOnly) params.is_featured = true;
    if (filters.minPrice) params.min_price = filters.minPrice;
    if (filters.maxPrice) params.max_price = filters.maxPrice;
    if (filters.selectedBrands.length > 0) params.brand = filters.selectedBrands.join(',');
    params.page = currentPage;
    return params;
  }, [searchQuery, selectedCategory, filters, currentPage]);

  const { data: productsData, isLoading: productsLoading } = useProducts(apiParams);
  
  // Mettre à jour les produits et la pagination
  useEffect(() => {
    if (productsData) {
      if (currentPage === 1) {
        setAllProducts(productsData.results || []);
      } else {
        setAllProducts(prev => [...prev, ...(productsData.results || [])]);
      }
      setNextPage(productsData.next || null);
      setTotalCount(productsData.count || 0);
    }
  }, [productsData, currentPage]);
  
  // Scroll vers la grille et réinitialiser la pagination quand la catégorie change
  useEffect(() => {
    if (selectedCategory) {
      setCurrentPage(1);
      setAllProducts([]);
      // Scroll vers le haut de la page
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 50);
    }
  }, [selectedCategory]);
  
  const products = allProducts;

  const { data: recommendedData } = useRecommendedProducts();
  const recommendedProducts = (recommendedData as any)?.results || [];

  // Extraction des marques uniques depuis les produits
  const availableBrands = useMemo(() => {
    if (!products) return [];
    const brands = [...new Set(products.map((p: any) => p.brand).filter(Boolean))];
    return brands.sort();
  }, [products]);


  // ============================================================================
  // GESTION DES FILTRES
  // ============================================================================
  const updateFilter = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Mise à jour des URL params
    const params = new URLSearchParams(searchParams);
    
    if (key === 'inStockOnly') {
      value ? params.set('in_stock', 'true') : params.delete('in_stock');
    } else if (key === 'promosOnly') {
      value ? params.set('has_discount', 'true') : params.delete('has_discount');
    } else if (key === 'featuredOnly') {
      value ? params.set('is_featured', 'true') : params.delete('is_featured');
    } else if (key === 'minPrice') {
      value ? params.set('min_price', value) : params.delete('min_price');
    } else if (key === 'maxPrice') {
      value ? params.set('max_price', value) : params.delete('max_price');
    } else if (key === 'selectedBrands') {
      value.length > 0 ? params.set('brands', value.join(',')) : params.delete('brands');
    }
    
    setSearchParams(params);
  };

  const clearAllFilters = () => {
    setFilters({
      inStockOnly: false,
      promosOnly: false,
      featuredOnly: false,
      minPrice: '',
      maxPrice: '',
      selectedBrands: [],
    });
    setSearchQuery('');
    setSearchParams({});
    setCurrentPage(1);
    setAllProducts([]);
  };

  const toggleBrand = (brand: string) => {
    const newBrands = filters.selectedBrands.includes(brand)
      ? filters.selectedBrands.filter((b: string) => b !== brand)
      : [...filters.selectedBrands, brand];
    updateFilter('selectedBrands', newBrands);
  };

  const hasActiveFilters = 
    searchQuery || 
    filters.inStockOnly || 
    filters.promosOnly || 
    filters.featuredOnly ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.selectedBrands.length > 0;

  // ============================================================================
  // COMPOSANT FILTRES (réutilisable sidebar + mobile)
  // ============================================================================
  const FiltersContent = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          Filtres
        </h3>
      </div>

      {/* Prix */}
      <div className="space-y-3">
        <label className="text-xs font-medium text-muted-foreground block">Prix (FCFA)</label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => updateFilter('minPrice', e.target.value)}
            className="text-sm"
          />
          <Input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => updateFilter('maxPrice', e.target.value)}
            className="text-sm"
          />
        </div>
      </div>

      {/* Marques */}
      {availableBrands.length > 0 && (
        <div className="space-y-3">
          <label className="text-xs font-medium text-muted-foreground block">Marques</label>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
            {availableBrands.map((brand: string) => (
              <div key={brand} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`brand-${brand}`}
                  checked={filters.selectedBrands.includes(brand)}
                  onChange={() => toggleBrand(brand)}
                  className="rounded"
                />
                <label htmlFor={`brand-${brand}`} className="text-sm cursor-pointer hover:text-primary transition-colors">
                  {brand}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Disponibilité */}
      <div className="space-y-3">
        <label className="text-xs font-medium text-muted-foreground block">Disponibilité</label>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="in-stock"
            checked={filters.inStockOnly}
            onChange={(e) => updateFilter('inStockOnly', e.target.checked)}
            className="rounded"
          />
          <label htmlFor="in-stock" className="text-sm cursor-pointer hover:text-primary transition-colors">
            En stock uniquement
          </label>
        </div>
      </div>

      {/* Offres spéciales */}
      <div className="space-y-3">
        <label className="text-xs font-medium text-muted-foreground block">Offres spéciales</label>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="promos"
              checked={filters.promosOnly}
              onChange={(e) => updateFilter('promosOnly', e.target.checked)}
              className="rounded"
            />
            <label htmlFor="promos" className="text-sm cursor-pointer hover:text-primary transition-colors">
              Produits en promotion
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featured"
              checked={filters.featuredOnly}
              onChange={(e) => updateFilter('featuredOnly', e.target.checked)}
              className="rounded"
            />
            <label htmlFor="featured" className="text-sm cursor-pointer hover:text-primary transition-colors">
              Produits vedettes
            </label>
          </div>
        </div>
      </div>

      {/* Bouton Réinitialiser */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          className="w-full transition-all duration-200 hover:bg-destructive hover:text-destructive-foreground"
          onClick={clearAllFilters}
        >
          Réinitialiser les filtres
        </Button>
      )}
    </div>
  );


  // ============================================================================
  // RENDER
  // ============================================================================
  return (
    <div className="flex flex-col min-h-screen">
      {/* Barre de recherche + Bouton filtres (mobile/tablette) - FIXED */}
      <div className="fixed top-16 left-0 right-0 z-40 bg-background/95 backdrop-blur border-b shadow-lg transition-all duration-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex gap-2 items-center">
            {/* Barre de recherche */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher des produits..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  const params = new URLSearchParams(searchParams);
                  if (e.target.value) params.set('search', e.target.value);
                  else params.delete('search');
                  setSearchParams(params);
                }}
                className="pl-10 w-full transition-all duration-200 focus:ring-2"
                data-testid="input-search-products"
              />
            </div>

            {/* Bouton filtres (mobile/tablette uniquement) */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="lg:hidden shrink-0 relative transition-all duration-200 hover:bg-primary hover:text-primary-foreground"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  {hasActiveFilters && (
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full animate-pulse" />
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filtres</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FiltersContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Layout principal: Sidebar + Grille */}
      <div className="flex flex-1 container mx-auto w-full px-4 pt-24 pb-8 gap-6">
        
        {/* Sidebar Filtres - STICKY (desktop uniquement) */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-32">
            <Card className="p-4 transition-shadow duration-200 hover:shadow-lg">
              <FiltersContent />
            </Card>

            {/* Tags filtres actifs */}
            {hasActiveFilters && (
              <div className="mt-4 space-y-2">
                {filters.inStockOnly && (
                  <div className="flex items-center justify-between gap-2 bg-secondary/30 p-2 rounded text-xs animate-in fade-in slide-in-from-left duration-300">
                    <span>En stock</span>
                    <button
                      onClick={() => updateFilter('inStockOnly', false)}
                      className="hover:text-destructive transition-colors duration-200"
                      aria-label="Retirer filtre en stock"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                {filters.promosOnly && (
                  <div className="flex items-center justify-between gap-2 bg-secondary/30 p-2 rounded text-xs animate-in fade-in slide-in-from-left duration-300">
                    <span>Promotions</span>
                    <button
                      onClick={() => updateFilter('promosOnly', false)}
                      className="hover:text-destructive transition-colors duration-200"
                      aria-label="Retirer filtre promotions"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                {filters.featuredOnly && (
                  <div className="flex items-center justify-between gap-2 bg-secondary/30 p-2 rounded text-xs animate-in fade-in slide-in-from-left duration-300">
                    <span>Vedettes</span>
                    <button
                      onClick={() => updateFilter('featuredOnly', false)}
                      className="hover:text-destructive transition-colors duration-200"
                      aria-label="Retirer filtre vedettes"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                {filters.selectedBrands.map((brand: string) => (
                  <div key={brand} className="flex items-center justify-between gap-2 bg-secondary/30 p-2 rounded text-xs animate-in fade-in slide-in-from-left duration-300">
                    <span className="truncate">{brand}</span>
                    <button
                      onClick={() => toggleBrand(brand)}
                      className="hover:text-destructive transition-colors duration-200 flex-shrink-0"
                      aria-label={`Retirer filtre ${brand}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {searchQuery && (
                  <div className="flex items-center justify-between gap-2 bg-secondary/30 p-2 rounded text-xs animate-in fade-in slide-in-from-left duration-300">
                    <span className="truncate">"{searchQuery}"</span>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        const params = new URLSearchParams(searchParams);
                        params.delete('search');
                        setSearchParams(params);
                      }}
                      className="hover:text-destructive transition-colors duration-200 flex-shrink-0"
                      aria-label="Retirer recherche"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </aside>

        {/* Contenu principal - Grille de produits */}
        <div className="flex-1 min-w-0">
          {/* Nombre de résultats */}
          {!productsLoading && products && (
            <div className="mb-6 animate-in fade-in duration-300">
              <p className="text-muted-foreground text-sm">
                {products.length} {products.length === 1 ? 'produit trouvé' : 'produits trouvés'}
              </p>
            </div>
          )}

          {/* État de chargement - Skeleton */}
          {productsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[...Array(12)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : products && products.length > 0 ? (
            <div className="space-y-8">
              {/* Grille principale des produits */}
              <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {products.map((product: any, index: number) => (
                  <div
                    key={product.id}
                    className="animate-in fade-in slide-in-from-bottom duration-300 hover:scale-[1.02] transition-transform"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              {/* Carousel Recommandations (séparé de la grille) */}
              {recommendedProducts.length > 0 && (
                <div className="py-8 bg-gradient-to-r from-secondary/20 via-secondary/30 to-secondary/20 rounded-lg animate-in fade-in slide-in-from-bottom duration-500 shadow-sm">
                  <div className="px-4">
                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                      ✨ Produits Recommandés pour vous
                    </h3>
                    <div className="relative -mx-4 md:-mx-12 lg:-mx-4">
                      <Carousel
                        opts={{
                          align: "start",
                          loop: true,
                        }}
                        className="w-full"
                      >
                        <CarouselContent className="-ml-2 sm:-ml-3">
                          {recommendedProducts.slice(0, 8).map((recProduct: any) => (
                            <CarouselItem key={recProduct.id} className="pl-2 sm:pl-3 basis-[calc(100%_/_1.25)] sm:basis-[calc(100%_/_2.3)] lg:basis-[calc(100%_/_3.3)]">
                              <div className="h-full px-2 transition-all duration-200 hover:scale-105">
                                <ProductCard product={recProduct} showCategoryBadge={false} />
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <CarouselPrevious className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background transition-all duration-200" />
                        <CarouselNext className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background transition-all duration-200" />
                      </Carousel>
                    </div>
                  </div>
                </div>
              )}

              {/* Boutons pagination */}
              {(nextPage || currentPage > 1) && (
                <div className="flex justify-center gap-4 mt-8 animate-in fade-in duration-300">
                  {currentPage > 1 && (
                    <Button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={productsLoading}
                      variant="outline"
                      className="px-8 py-2 transition-all duration-200 hover:scale-105"
                      data-testid="button-previous-page"
                    >
                      ← Précédent
                    </Button>
                  )}
                  {nextPage && (
                    <Button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={productsLoading}
                      className="px-8 py-2 transition-all duration-200 hover:scale-105"
                      data-testid="button-load-more-products"
                    >
                      {productsLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Chargement...
                        </>
                      ) : (
                        <>
                          Suivant →
                        </>
                      )}
                    </Button>
                  )}
                </div>
              )}
            </div>
          ) : (
            // État vide
            <div className="text-center py-20 animate-in fade-in duration-500">
              <div className="max-w-md mx-auto space-y-4">
                <div className="text-6xl mb-4 animate-bounce">🔍</div>
                <p className="text-muted-foreground text-lg mb-4">
                  {hasActiveFilters 
                    ? 'Aucun produit ne correspond à vos critères de recherche' 
                    : 'Aucun produit disponible pour le moment'}
                </p>
                {hasActiveFilters && (
                  <Button 
                    onClick={clearAllFilters} 
                    className="transition-all duration-200 hover:scale-105"
                    data-testid="button-reset-search"
                  >
                    Effacer les filtres
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bande catégories fixe en bas avec scroll horizontal */}
      <CategoryBand categories={allCategories} isFixed={true} />
    </div>
  );
};

export default Products;