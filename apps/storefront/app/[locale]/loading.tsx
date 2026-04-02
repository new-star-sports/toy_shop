import { HeroSkeleton, ProductSectionSkeleton, CategoryGridSkeleton, BrandGridSkeleton } from "../_components/skeletons";

export default function Loading() {
  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <HeroSkeleton />
      <div className="max-w-7xl mx-auto space-y-10">
        <CategoryGridSkeleton />
        <ProductSectionSkeleton />
        <ProductSectionSkeleton />
        <BrandGridSkeleton />
      </div>
    </div>
  );
}
