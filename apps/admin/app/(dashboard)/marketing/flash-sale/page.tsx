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
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Flash Sale System</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Configure global flash sale timing and manage participating products.
          </p>
        </div>
        <div className="w-full sm:w-auto">
          <ProductSearchDialog />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-8">
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
