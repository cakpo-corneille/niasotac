import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Category } from '@/hooks/useCategories';
import { ArrowRight, Laptop, Cpu, Printer, Headphones, Box } from 'lucide-react';

interface CategoryCardProps {
  category: Category;
}

const iconMap: Record<string, any> = {
  laptop: Laptop,
  memory: Cpu,
  print: Printer,
  devices: Headphones,
  computer: Laptop,
  cpu: Cpu,
  printer: Printer,
  headphones: Headphones,
};

export const CategoryCard = ({ category }: CategoryCardProps) => {
  const Icon = (category.icon && iconMap[category.icon]) || Box;

  return (
    <Link to={`/products?category=${category.slug}`}>
      <Card className="group hover:card-shadow-hover transition-all duration-300 hover:scale-105 cursor-pointer overflow-hidden h-full">
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
              <Icon className="h-10 w-10 text-primary group-hover:text-primary-foreground transition-colors" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                {category.name}
              </h3>
              <div className="text-xs text-muted-foreground pt-2">
                {category.subcategories.length} sous-catégories • {category.product_count} produits
              </div>
            </div>
            
            <div className="flex items-center text-sm font-medium text-primary group-hover:gap-2 transition-all">
              Parcourir <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
