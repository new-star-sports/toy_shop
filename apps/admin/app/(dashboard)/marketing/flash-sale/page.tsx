import { getSetting } from "@nss/db/queries";
import { getFlashSaleProducts } from "./_actions";
import { FlashSaleForm } from "./_components/flash-sale-form";
import { FlashSaleProductTable } from "./_components/product-table";
import { ProductSearchDialog } from "./_components/product-search";

export default async function FlashSalePage() {
  const [settings, productsResult] = await Promise.all([
    getSetting("flash_sale"),
    getFlashSaleProducts(),
  ]);

  const flashSaleProducts = productsResult.success ? productsResult.data : [];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-nss-text-primary">Flash Sale System</h1>
          <p className="text-sm text-nss-text-secondary">
            Configure global flash sale timing and manage participating products.
          </p>
        </div>
        <ProductSearchDialog />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <FlashSaleForm initialData={settings} />
        </div>
        <div className="lg:col-span-2">
          <FlashSaleProductTable products={flashSaleProducts || []} />
        </div>
      </div>
    </div>
  );
}
