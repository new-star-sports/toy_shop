"use client";

import { useState } from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle,
  Button
} from "@nss/ui";
import { IconPlus, IconPencil } from "@tabler/icons-react";
import { BrandForm } from "./brand-form";
import type { Brand } from "@nss/db/types";

interface BrandSheetFormProps {
  mode: "create" | "edit";
  brand?: Brand | null;
  trigger?: React.ReactNode;
}

export function BrandSheetForm({ mode, brand, trigger }: BrandSheetFormProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {trigger ? (
        <div onClick={() => setOpen(true)} className="cursor-pointer">
          {trigger}
        </div>
      ) : (
        <Button onClick={() => setOpen(true)} className="gap-2">
          {mode === "create" ? (
            <>
              <IconPlus size={16} stroke={2} />
              Add Brand
            </>
          ) : (
            <>
              <IconPencil size={14} stroke={1.5} />
              Edit
            </>
          )}
        </Button>
      )}
      <SheetContent className="sm:max-w-xl overflow-y-auto">
        <SheetHeader className="mb-8">
          <SheetTitle>{mode === "create" ? "Add New Brand" : "Edit Brand"}</SheetTitle>
          <SheetDescription>
            {mode === "create" 
              ? "Fill in the details below to create a new brand." 
              : "Update the brand details below."}
          </SheetDescription>
        </SheetHeader>
        <div className="pb-20">
           <BrandForm 
            initialData={brand} 
            onSuccess={() => setOpen(false)} 
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
