import { createServiceClient } from "../client";

export async function getDashboardStats() {
  const supabase = createServiceClient();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayISO = today.toISOString();

  // 1. Revenue & Orders Today
  const { data: ordersToday, error: ordersError } = await supabase
    .from("orders")
    .select("total_kwd")
    .gte("created_at", todayISO);

  if (ordersError) throw ordersError;

  const revenueToday = (ordersToday as any[]).reduce((sum, o) => sum + Number(o.total_kwd), 0);
  const orderCountToday = ordersToday.length;

  // 2. Low Stock Items
  // We need to check both products and variants
  const { data: lowStockProducts, error: lsProdError } = await supabase
    .from("products")
    .select("id, stock_quantity, low_stock_threshold")
    .lt("stock_quantity", 5); // Default threshold if not set
    // Note: Ideally we'd compare stock_quantity < low_stock_threshold in SQL but PostgREST 
    // doesn't support column-to-column comparison easily without RPC. 
    // For now we use a fixed threshold or fetch and filter.

  if (lsProdError) throw lsProdError;

  const { data: lowStockVariants, error: lsVarError } = await supabase
    .from("product_variants")
    .select("id, stock_quantity")
    .lt("stock_quantity", 5);

  if (lsVarError) throw lsVarError;

  const lowStockCount = (lowStockProducts?.length || 0) + (lowStockVariants?.length || 0);

  // 3. New Customers Today
  const { count: customerCount, error: customerError } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .gte("created_at", todayISO);

  if (customerError) throw customerError;

  return {
    revenueToday,
    orderCountToday,
    lowStockCount,
    customerCount: customerCount || 0,
  };
}
