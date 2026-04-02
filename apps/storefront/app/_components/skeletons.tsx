import { Skeleton } from "@/components/ui/skeleton";

export function SectionHeaderSkeleton() {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <Skeleton className="w-1.5 h-7 rounded-full shrink-0 bg-muted/60" />
        <Skeleton className="h-7 w-48 rounded-lg bg-muted/60" />
      </div>
      <Skeleton className="h-8 w-24 rounded-full bg-muted/60" />
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="aspect-square w-full rounded-[2rem] bg-muted/40" />
      <div className="space-y-2 px-1">
        <Skeleton className="h-4 w-3/4 rounded bg-muted/60" />
        <Skeleton className="h-4 w-1/2 rounded bg-muted/60" />
      </div>
    </div>
  );
}

export function ProductSectionSkeleton() {
  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeaderSkeleton />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function HeroSkeleton() {
  return (
    <section className="pt-6 pb-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Skeleton className="w-full aspect-[16/7] sm:aspect-[21/7] rounded-[2rem] bg-muted/40" />
      </div>
    </section>
  );
}

export function CategoryGridSkeleton() {
  return (
    <section className="py-10 bg-muted/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeaderSkeleton />
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <Skeleton className="w-full aspect-square rounded-[1.5rem] bg-muted/40" />
              <Skeleton className="h-3 w-16 rounded bg-muted/60" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function BrandGridSkeleton() {
    return (
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeaderSkeleton />
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="w-full aspect-square rounded-[1.5rem] bg-muted/40" />
            ))}
          </div>
        </div>
      </section>
    );
}

export function BannerSkeleton() {
  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Skeleton className="w-full h-48 sm:h-64 rounded-[2.5rem] bg-muted/40" />
      </div>
    </section>
  );
}

export function SearchHeaderSkeleton() {
  return (
    <div className="clay-shadow-sky rounded-[2rem] bg-white p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
      <div className="space-y-2">
        <Skeleton className="h-7 w-32 rounded bg-muted/60" />
        <Skeleton className="h-4 w-48 rounded bg-muted/40" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-9 w-24 rounded-full bg-muted/40" />
        <Skeleton className="h-9 w-32 rounded-full bg-muted/40" />
      </div>
    </div>
  );
}

export function FilterSkeleton() {
  return (
    <div className="space-y-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="h-5 w-24 rounded bg-muted/60" />
          <div className="space-y-2">
            {[...Array(4)].map((_, j) => (
              <Skeleton key={j} className="h-4 w-full rounded bg-muted/40" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function CategoryHeroSkeleton() {
  return (
    <div className="mx-4 sm:mx-6 lg:mx-8 mt-4">
      <Skeleton className="w-full aspect-[21/6] sm:aspect-[21/5] rounded-[2rem] bg-muted/40" />
    </div>
  );
}

export function SubcategorySkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-3">
      <div className="flex items-center gap-2 py-1 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-8 w-24 rounded-full bg-muted/40 shrink-0" />
        ))}
      </div>
    </div>
  );
}
