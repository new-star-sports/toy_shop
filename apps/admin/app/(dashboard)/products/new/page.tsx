import { getCategories, getBrands } from "@nss/db/queries";
import { ProductForm } from "../../_components/products/product-form";

export default async function NewProductPage() {
  const [categories, brands] = await Promise.all([
    getCategories(),
    getBrands(),
  ]);

  return (
    <div className="max-w-5xl mx-auto">
      <ProductForm categories={categories} brands={brands} />
    </div>
  );
}
