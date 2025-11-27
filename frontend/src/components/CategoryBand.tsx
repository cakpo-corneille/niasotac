import { Category } from '@/hooks/useCategories';
import { getCategoryIcon } from '@/lib/categoryIcons';
import { Button } from '@/components/ui/button';
import { useSearchParams } from 'react-router-dom';

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
      className={`bg-card border-t border-border py-4 ${
        isFixed ? 'fixed bottom-0 left-0 right-0 z-40 shadow-lg' : ''
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="overflow-x-auto hide-scrollbar">
          <div className="flex gap-2 min-w-min">
            {categories.map((category) => {
              const Icon = getCategoryIcon(category.slug, category.name);
              const isActive = activeCategory === category.slug;

              return (
                <Button
                  key={category.id}
                  variant={isActive ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleCategoryClick(category.slug)}
                  className="flex items-center gap-2 whitespace-nowrap"
                  data-testid={`button-category-${category.slug}`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{category.name}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const style = document.createElement('style');
style.textContent = `
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;
if (typeof document !== 'undefined') {
  document.head.appendChild(style);
}
