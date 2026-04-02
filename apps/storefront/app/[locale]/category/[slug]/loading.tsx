import { 
  CategoryHeroSkeleton, 
  SubcategorySkeleton, 
  FilterSkeleton 
} from "../../../_components/skeletons";

export default function CategoryLoading() {
  return (
    <div className="animate-in fade-in duration-500">
      <CategoryHeroSkeleton />
      <SubcategorySkeleton />
      
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <aside className="hidden lg:block lg:col-span-1 space-y-6">
              <div className="bg-white rounded-[2rem] clay-shadow-lavender p-4">
                <FilterSkeleton />
              </div>
            </aside>

            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-4 gap-3">
                <div className="h-5 w-24 rounded bg-muted/10 animate-pulse" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <div className="aspect-square w-full rounded-[2rem] bg-muted/10 animate-pulse" />
                    <div className="h-4 w-3/4 rounded bg-muted/20 animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
