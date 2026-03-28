import { getCategories, getBrands } from "@nss/db/queries";
import { ProductForm } from "../../_components/products/product-form";

export default async function NewProductPage() {
  const [categories, brands] = await Promise.all([
    getCategories(),
    getBrands(),
  ]);

  return (
    <div className="min-h-screen bg-background">
      <main className="flex-1">
        <div className="pt-[73px] lg:pt-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
            <ProductForm categories={categories} brands={brands} />
          </div>
        </div>
      </main>
    </div>
  );
}
