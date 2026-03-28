"use client";

import { removeAddress, setDefaultAddress } from "@/app/_actions/address";
import { Button } from "@/components/ui";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui";
import { Badge } from "@/components/ui";
import { MapPin, Phone, User, Trash2, Edit2, Star } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { useTransition } from "react";

interface AddressCardProps {
  address: any;
  locale: Locale;
}

export function AddressCard({ address, locale }: AddressCardProps) {
  const isAr = locale === "ar";
  const [isDeleting, startDeleteTransition] = useTransition();
  const [isSettingDefault, startDefaultTransition] = useTransition();

  const handleDelete = () => {
    if (confirm(isAr ? "هل أنت متأكد من حذف هذا العنوان؟" : "Are you sure you want to delete this address?")) {
      startDeleteTransition(async () => {
        await removeAddress(address.id, locale);
      });
    }
  };

  const handleSetDefault = () => {
    startDefaultTransition(async () => {
      await setDefaultAddress(address.id, locale);
    });
  };

  return (
    <Card className={`relative overflow-hidden border-2 transition-all ${address.is_default ? "border-nss-primary/20 shadow-md" : "border-nss-border/50 hover:border-nss-primary/10"}`}>
      {address.is_default && (
        <div className="absolute top-0 right-0 p-2">
          <Badge className="bg-nss-primary hover:bg-nss-primary text-white border-none text-[10px] px-2 py-0">
            {isAr ? "الافتراضي" : "DEFAULT"}
          </Badge>
        </div>
      )}
      
      <CardHeader className="pb-2 space-y-1">
        <div className="flex items-center gap-2 text-nss-primary">
          <User className="h-4 w-4" />
          <span className="font-semibold">{address.recipient_name}</span>
        </div>
        <div className="flex items-center gap-2 text-nss-text-secondary text-sm">
          <Phone className="h-4 w-4 shrink-0" />
          <span dir="ltr">{address.recipient_phone}</span>
        </div>
      </CardHeader>

      <CardContent className="pb-4 text-sm text-nss-text-primary">
        <div className="flex gap-2">
          <MapPin className="h-4 w-4 mt-0.5 text-nss-text-secondary shrink-0" />
          <div className="space-y-1">
            <p className="font-medium">
              {isAr ? address.governorate?.name_ar : address.governorate?.name_en}, {isAr ? address.area?.name_ar : address.area?.name_en}
            </p>
            <p className="text-nss-text-secondary">
              {isAr ? "قطعة" : "Block"} {address.block}, {isAr ? "شارع" : "Street"} {address.street}, {isAr ? "جادة" : "Avenue"} {address.building}
            </p>
            {(address.floor || address.apartment) && (
              <p className="text-nss-text-secondary">
                {address.floor && `${isAr ? "دور" : "Floor"} ${address.floor}`}
                {address.floor && address.apartment && " — "}
                {address.apartment && `${isAr ? "شقة" : "Apt"} ${address.apartment}`}
              </p>
            )}
            {address.landmark && (
              <p className="text-xs text-nss-text-secondary italic mt-1">
                {isAr ? "علامة مميزة:" : "Landmark:"} {address.landmark}
              </p>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-2 border-t border-nss-border/50 flex gap-2">
        {!address.is_default && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex-1 text-xs h-8 gap-1.5 hover:text-nss-primary hover:bg-nss-primary/5"
            onClick={handleSetDefault}
            disabled={isSettingDefault}
          >
            <Star className={`h-3 w-3 ${isSettingDefault ? 'animate-pulse' : ''}`} />
            {isAr ? "تعيين كافتراضي" : "Set Default"}
          </Button>
        )}
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs h-8 gap-1.5 text-nss-text-secondary hover:text-nss-primary hover:bg-nss-primary/5"
          asChild
        >
          <a href={`/${locale}/account/addresses/${address.id}`}>
            <Edit2 className="h-3 w-3" />
            {isAr ? "تعديل" : "Edit"}
          </a>
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs h-8 gap-1.5 text-nss-text-secondary hover:text-red-600 hover:bg-red-50"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          <Trash2 className={`h-3 w-3 ${isDeleting ? 'animate-pulse' : ''}`} />
          {isAr ? "حذف" : "Delete"}
        </Button>
      </CardFooter>
    </Card>
  );
}
