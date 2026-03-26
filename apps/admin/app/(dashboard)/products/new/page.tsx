import { getCategories, getBrands } from "@nss/db/queries";
import { ProductForm } from "../../_components/products/product-form";

export default async function NewProductPage() {
  const [categories, brands] = await Promise.all([
    getCategories(),
    getBrands(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <ProductForm categories={categories} brands={brands} />
    </div>

  );
}
