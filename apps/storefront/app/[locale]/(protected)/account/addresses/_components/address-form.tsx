"use client";

import { useState, useEffect, useTransition } from "react";
import { saveAddress, getAreas } from "@/app/_actions/address";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import { Label } from "@/components/ui";
import { Checkbox } from "@/components/ui";
import { Alert, AlertDescription } from "@/components/ui";
import { MapPin, User, Building2, Home, Briefcase, Plus } from "lucide-react";
import type { Locale } from "@/lib/i18n";

interface AddressFormProps {
  locale: Locale;
  governorates: any[];
  initialData?: any;
}

export function AddressForm({ locale, governorates, initialData }: AddressFormProps) {
  const isAr = locale === "ar";
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  
  const [selectedGov, setSelectedGov] = useState(initialData?.governorate_id || "");
  const [areas, setAreas] = useState<any[]>([]);
  const [isLoadingAreas, setIsLoadingAreas] = useState(false);

  useEffect(() => {
    if (selectedGov) {
      setIsLoadingAreas(true);
      getAreas(selectedGov).then((data) => {
        setAreas(data || []);
        setIsLoadingAreas(false);
      });
    } else {
      setAreas([]);
    }
  }, [selectedGov]);

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const result = await saveAddress(formData, locale, initialData?.id);
      if (result?.error) {
        setError(result.error);
      }
    });
  };

  return (
    <form action={handleSubmit} className="space-y-8">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recipient Details */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <User className="h-4 w-4" />
            {isAr ? "بيانات المستلم" : "Recipient Details"}
          </h3>
          <div className="space-y-2">
            <Label htmlFor="recipientName">{isAr ? "الاسم الكامل" : "Full Name"}</Label>
            <Input
              id="recipientName"
              name="recipientName"
              placeholder={isAr ? "أدخل الاسم الكامل" : "Enter full name"}
              defaultValue={initialData?.recipient_name}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="recipientPhone">{isAr ? "رقم الهاتف" : "Phone Number"}</Label>
            <Input
              id="recipientPhone"
              name="recipientPhone"
              type="tel"
              placeholder="+965 XXXX XXXX"
              defaultValue={initialData?.recipient_phone}
              required
            />
          </div>
        </div>

        {/* Address Type */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {isAr ? "نوع العنوان" : "Address Type"}
          </h3>
          <div className="flex gap-4">
            <label className="flex-1 cursor-pointer">
              <input
                type="radio"
                name="addressType"
                value="home"
                className="peer sr-only"
                defaultChecked={!initialData || initialData.address_type === "home"}
              />
              <div className="flex flex-col items-center justify-center p-4 border-2 border-border rounded-xl bg-white transition-all peer-checked:border-primary peer-checked:bg-primary/5 hover:border-primary/20">
                <Home className="h-6 w-6 mb-2 text-muted-foreground peer-checked:text-primary" />
                <span className="text-xs font-medium">{isAr ? "منزل" : "Home"}</span>
              </div>
            </label>
            <label className="flex-1 cursor-pointer">
              <input
                type="radio"
                name="addressType"
                value="work"
                className="peer sr-only"
                defaultChecked={initialData?.address_type === "work"}
              />
              <div className="flex flex-col items-center justify-center p-4 border-2 border-border rounded-xl bg-white transition-all peer-checked:border-primary peer-checked:bg-primary/5 hover:border-primary/20">
                <Briefcase className="h-6 w-6 mb-2 text-muted-foreground peer-checked:text-primary" />
                <span className="text-xs font-medium">{isAr ? "عمل" : "Work"}</span>
              </div>
            </label>
            <label className="flex-1 cursor-pointer">
              <input
                type="radio"
                name="addressType"
                value="other"
                className="peer sr-only"
                defaultChecked={initialData?.address_type === "other"}
              />
              <div className="flex flex-col items-center justify-center p-4 border-2 border-border rounded-xl bg-white transition-all peer-checked:border-primary peer-checked:bg-primary/5 hover:border-primary/20">
                <Plus className="h-6 w-6 mb-2 text-muted-foreground peer-checked:text-primary" />
                <span className="text-xs font-medium">{isAr ? "آخر" : "Other"}</span>
              </div>
            </label>
          </div>
        </div>
      </div>

      <hr className="border-border/50" />

      {/* Location Details */}
      <div className="space-y-6">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          {isAr ? "بيانات الموقع" : "Location Details"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="governorateId">{isAr ? "المحافظة" : "Governorate"}</Label>
            <select
              id="governorateId"
              name="governorateId"
              className="w-full h-10 px-3 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none"
              value={selectedGov}
              onChange={(e) => setSelectedGov(e.target.value)}
              required
            >
              <option value="">{isAr ? "اختر المحافظة" : "Select Governorate"}</option>
              {governorates.map((gov) => (
                <option key={gov.id} value={gov.id}>
                  {isAr ? gov.name_ar : gov.name_en}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="areaId">{isAr ? "المنطقة" : "Area"}</Label>
            <select
              id="areaId"
              name="areaId"
              className="w-full h-10 px-3 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none disabled:bg-muted disabled:cursor-not-allowed"
              defaultValue={initialData?.area_id}
              disabled={!selectedGov || isLoadingAreas}
              required
            >
              <option value="">{isAr ? "اختر المنطقة" : "Select Area"}</option>
              {areas.map((area) => (
                <option key={area.id} value={area.id}>
                  {isAr ? area.name_ar : area.name_en}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="block">{isAr ? "قطعة" : "Block"}</Label>
            <Input id="block" name="block" defaultValue={initialData?.block} required />
          </div>
          <div className="col-span-1 md:col-span-2 space-y-2">
            <Label htmlFor="street">{isAr ? "شارع" : "Street"}</Label>
            <Input id="street" name="street" defaultValue={initialData?.street} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="building">{isAr ? "جادة / مبنى" : "Avenue / Building"}</Label>
            <Input id="building" name="building" defaultValue={initialData?.building} required />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="floor">{isAr ? "الدور (اختياري)" : "Floor (Optional)"}</Label>
            <Input id="floor" name="floor" defaultValue={initialData?.floor} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="apartment">{isAr ? "شقة (اختياري)" : "Apartment (Optional)"}</Label>
            <Input id="apartment" name="apartment" defaultValue={initialData?.apartment} />
          </div>
          <div className="col-span-2 space-y-2">
            <Label htmlFor="landmark">{isAr ? "علامة مميزة (اختياري)" : "Landmark (Optional)"}</Label>
            <Input 
              id="landmark" 
              name="landmark" 
              placeholder={isAr ? "مثال: خلف المسجد" : "e.g. Behind the mosque"} 
              defaultValue={initialData?.landmark}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 space-x-reverse">
        <Checkbox 
          id="isDefault" 
          name="isDefault" 
          value="true" 
          defaultChecked={initialData?.is_default}
        />
        <Label htmlFor="isDefault" className="text-sm font-normal cursor-pointer select-none">
          {isAr ? "تعيين كعنوان افتراضي" : "Set as default address"}
        </Label>
      </div>

      <div className="flex gap-4 pt-4 border-t border-border/50">
        <Button 
          type="submit" 
          className="flex-1 bg-primary hover:bg-primary/90 h-11 text-base"
          disabled={isPending}
        >
          {isPending ? (isAr ? "جاري الحفظ..." : "Saving...") : (isAr ? "حفظ العنوان" : "Save Address")}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => window.history.back()}
          className="h-11 px-8"
        >
          {isAr ? "إلغاء" : "Cancel"}
        </Button>
      </div>
    </form>
  );
}
