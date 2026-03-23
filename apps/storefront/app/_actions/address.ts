"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { 
  createAddress, 
  updateAddress, 
  deleteAddress, 
  unsetOtherDefaultAddresses,
  getAreasByGovernorate
} from "@nss/db/queries";
import type { Locale } from "@/lib/i18n";

export async function getAreas(governorateId: string) {
  const supabase = await createClient();
  return getAreasByGovernorate(supabase, governorateId);
}

export async function saveAddress(formData: FormData, locale: Locale, addressId?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const addressData = {
    user_id: user.id,
    recipient_name: formData.get("recipientName") as string,
    recipient_phone: formData.get("recipientPhone") as string,
    governorate_id: formData.get("governorateId") as string,
    area_id: formData.get("areaId") as string,
    block: formData.get("block") as string,
    street: formData.get("street") as string,
    building: formData.get("building") as string,
    floor: formData.get("floor") as string || null,
    apartment: formData.get("apartment") as string || null,
    landmark: formData.get("landmark") as string || null,
    address_type: formData.get("addressType") as any || "home",
    is_default: formData.get("isDefault") === "true",
  };

  try {
    let result;
    if (addressId) {
      result = await updateAddress(supabase, addressId, addressData);
    } else {
      result = await createAddress(supabase, addressData);
    }

    if (addressData.is_default && result) {
      await unsetOtherDefaultAddresses(supabase, user.id, result.id);
    }

    revalidatePath(`/${locale}/account/addresses`);
  } catch (error: any) {
    return { error: error.message };
  }

  redirect(`/${locale}/account/addresses`);
}

export async function removeAddress(id: string, locale: Locale) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  try {
    await deleteAddress(supabase, id);
    revalidatePath(`/${locale}/account/addresses`);
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function setDefaultAddress(id: string, locale: Locale) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  try {
    await updateAddress(supabase, id, { is_default: true });
    await unsetOtherDefaultAddresses(supabase, user.id, id);
    revalidatePath(`/${locale}/account/addresses`);
  } catch (error: any) {
    return { error: error.message };
  }
}
