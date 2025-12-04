import { Category } from '@/hooks/useCategories';
import { getCategoryIcon } from '@/lib/categoryIcons';
import { Button } from '@/components/ui/button';
import { useSearchParams } from 'react-router-dom';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';

interface CategoryBandProps {
  categories: Category[];
  isFixed?: boolean;
}

export const CategoryBand = ({ categories, isFixed = false }: CategoryBandProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category');

  const handleCategoryClick = (slug: string) => {
    if (activeCategory === slug) {
      setSearchParams({});
    } else {
      setSearchParams({ category: slug });
    }
  };

  return (
    <div
      className={`bg-card border-t border-border ${
        isFixed ? 'fixed bottom-0 left-0 right-0 z-40 shadow-lg' : ''
      }`}
    >
      <div className="w-full">
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="py-4">
            {categories.map((category) => {
              const Icon = getCategoryIcon(category.slug, category.name);
              const isActive = activeCategory === category.slug;

              return (
                <CarouselItem key={category.id} className="basis-auto">
                  <Button
                    variant={isActive ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleCategoryClick(category.slug)}
                    className="flex items-center justify-center p-2 flex-shrink-0"
                    title={category.name}
                    data-testid={`button-category-${category.slug}`}
                  >
                    <Icon className="h-5 w-5" />
                  </Button>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background transition-all duration-200 h-8 w-8" />
          <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background transition-all duration-200 h-8 w-8" />
        </Carousel>
      </div>
    </div>
  );
};
