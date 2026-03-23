import { createServiceClient } from "../client";
import type { Profile, Address, Order } from "../types";

export interface CustomerWithStats extends Profile {
  email: string | null;
  total_orders: number;
  total_spent_kwd: number;
  addresses?: Address[];
  orders?: Order[];
}

/**
 * Admin: Fetch paginated list of customers with basic stats
 */
export async function getAdminCustomers(options?: {
  page?: number;
  perPage?: number;
  search?: string;
}): Promise<{ data: CustomerWithStats[]; count: number }> {
  const supabase = createServiceClient();
  const page = options?.page ?? 1;
  const perPage = options?.perPage ?? 20;
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  // Since we can't easily join auth.users for email, we fetch profiles 
  // and join with orders to get customer_email and stats.
  let query = supabase
    .from("profiles")
    .select(`
      *,
      orders ( id, total_kwd, customer_email )
    `, { count: "exact" })
    .range(from, to)
    .order("created_at", { ascending: false });

  if (options?.search) {
    query = query.or(`full_name.ilike.%${options.search}%,phone.ilike.%${options.search}%`);
  }

  const { data, count, error } = await query;
  if (error) throw error;

  const customers: CustomerWithStats[] = (data ?? []).map((p: any) => {
    const orders = (p.orders as any[]) ?? [];
    const totalSpent = orders.reduce((sum, o) => sum + Number(o.total_kwd), 0);
    // Use the email from the most recent order as a fallback
    const email = orders[0]?.customer_email ?? null;

    return {
      ...p,
      email,
      total_orders: orders.length,
      total_spent_kwd: totalSpent,
    };
  });

  return { data: customers, count: count ?? 0 };
}

/**
 * Admin: Fetch a single customer by ID with full details
 */
export async function getAdminCustomerById(id: string): Promise<CustomerWithStats | null> {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("profiles")
    .select(`
      *,
      addresses ( * ),
      orders ( * )
    `)
    .eq("id", id)
    .single();

  if (error || !data) return null;

  const p = data as any;
  const orders = (p.orders as any[]) ?? [];
  const totalSpent = orders.reduce((sum, o) => sum + Number(o.total_kwd), 0);
  const email = orders[0]?.customer_email ?? null;

  return {
    ...p,
    email,
    addresses: p.addresses ?? [],
    orders: orders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
    total_orders: orders.length,
    total_spent_kwd: totalSpent,
  };
}
