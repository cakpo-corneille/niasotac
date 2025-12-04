import { Card } from '@/components/ui/card';

export const ProductSkeleton = () => (
  <Card className="overflow-hidden animate-pulse">
    <div className="aspect-square w-full bg-secondary" />
    <div className="p-3 space-y-3">
      <div className="h-4 bg-secondary rounded w-3/4" />
      <div className="h-4 bg-secondary rounded w-1/2" />
      <div className="space-y-2">
        <div className="h-6 bg-secondary rounded w-1/2" />
        <div className="h-3 bg-secondary rounded w-2/3" />
      </div>
      <div className="h-8 bg-secondary rounded" />
    </div>
  </Card>
);
