import { getAdminProductById, getCategories, getBrands } from "@nss/db/queries";
import { ProductForm } from "../../_components/products/product-form";
import { notFound } from "next/navigation";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [product, categories, brands] = await Promise.all([
    getAdminProductById(id),
    getCategories(),
    getBrands(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <ProductForm 
        initialData={product} 
        categories={categories} 
        brands={brands} 
      />
    </div>
  );
}
