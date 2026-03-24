// Address queries for storefront and admin

export async function getUserAddresses(supabase: any, userId: string) {
  const { data, error } = await supabase
    .from("addresses")
    .select(`
      *,
      governorate:governorates(id, name_en, name_ar),
      area:areas(id, name_en, name_ar)
    `)
    .eq("user_id", userId)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getAddressById(supabase: any, id: string) {
  const { data, error } = await supabase
    .from("addresses")
    .select(`
      *,
      governorate:governorates(id, name_en, name_ar),
      area:areas(id, name_en, name_ar)
    `)
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function createAddress(supabase: any, address: any) {
  const { data, error } = await supabase
    .from("addresses")
    .insert(address)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateAddress(supabase: any, id: string, address: any) {
  // @ts-ignore - Supabase update type mismatch in monorepo
  const { data, error } = (await supabase.from("addresses").update(address).eq("id", id).select().single()) as any;

  if (error) throw error;
  return data;
}

export async function deleteAddress(supabase: any, id: string) {
  const { error } = await supabase
    .from("addresses")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

export async function unsetOtherDefaultAddresses(supabase: any, userId: string, excludeId: string) {
  // @ts-ignore - Supabase update type mismatch in monorepo
  const { error } = (await supabase.from("addresses").update({ is_default: false }).eq("user_id", userId).neq("id", excludeId)) as any;

  if (error) throw error;
}

export async function getGovernorates(supabase: any) {
  const { data, error } = await supabase
    .from("governorates")
    .select("*")
    .eq("is_active", true)
    .order("name_en", { ascending: true });

  if (error) throw error;
  return data;
}

export async function getAreasByGovernorate(supabase: any, govId: string) {
  const { data, error } = await supabase
    .from("areas")
    .select("*")
    .eq("governorate_id", govId)
    .eq("is_active", true)
    .order("name_en", { ascending: true });

  if (error) throw error;
  return data;
}
