"use client";

import { useState } from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle,
  Button
} from "@/components/ui";
import { IconPlus, IconPencil } from "@tabler/icons-react";
import { CategoryForm } from "./category-form";
import type { Category } from "@nss/db/types";

interface CategorySheetFormProps {
  mode: "create" | "edit";
  category?: Category | null;
  categories: Category[];
  trigger?: React.ReactNode;
}

export function CategorySheetForm({ mode, category, categories, trigger }: CategorySheetFormProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {trigger ? (
        <div onClick={() => setOpen(true)} className="cursor-pointer">
          {trigger}
        </div>
      ) : (
        <Button onClick={() => setOpen(true)} className="flex items-center gap-2">
          {mode === "create" ? (
            <>
              <IconPlus size={16} stroke={2} />
              Add Category
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
          <SheetTitle>{mode === "create" ? "Add New Category" : "Edit Category"}</SheetTitle>
          <SheetDescription>
            {mode === "create" 
              ? "Fill in the details below to create a new product category." 
              : "Update the category details below."}
          </SheetDescription>
        </SheetHeader>
        <div className="pb-20">
           <CategoryForm 
            initialData={category} 
            categories={categories} 
            onSuccess={() => setOpen(false)} 
            onCancel={() => setOpen(false)} 
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
