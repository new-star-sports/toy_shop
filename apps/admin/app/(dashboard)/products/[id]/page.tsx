import { getAdminProductById, getCategories, getBrands } from "@nss/db/queries";
import { ProductForm } from "../../_components/products/product-form";
import { notFound } from "next/navigation";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  const [product, categories, brands] = await Promise.all([
    getAdminProductById(id),
    getCategories(),
    getBrands(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto pb-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-nss-text-primary">Edit Product</h1>
        <p className="text-sm text-nss-text-secondary">
          Update your product details, inventory, and safety compliance.
        </p>
      </div>
      <ProductForm 
        initialData={product} 
        categories={categories} 
        brands={brands} 
      />
    </div>
  );
}
