"use client";

import { useState } from "react";
import { Button } from "@nss/ui/components/button";
import { Input } from "@nss/ui/components/input";
import { updateStockAction } from "../../inventory/_actions";

interface StockUpdateFormProps {
  id: string;
  type: "product" | "variant";
  currentStock: number;
}

export function StockUpdateForm({ id, type, currentStock }: StockUpdateFormProps) {
  const [stock, setStock] = useState(currentStock.toString());
  const [isPending, setIsPending] = useState(false);

  const hasChanged = parseInt(stock) !== currentStock && !isNaN(parseInt(stock));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const quantity = parseInt(stock);
    if (isNaN(quantity)) return;

    setIsPending(true);
    const result = await updateStockAction(id, type, quantity);
    setIsPending(false);

    if (!result.success) {
      alert(result.error);
      setStock(currentStock.toString());
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center justify-end gap-2">
      <Input
        type="number"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
        className="w-20 h-9 text-sm text-center font-mono bg-nss-surface focus:bg-white"
        disabled={isPending}
      />
      <Button 
        type="submit" 
        size="sm" 
        variant={hasChanged ? "default" : "ghost"} 
        className={`h-9 min-w-[60px] transition-all ${!hasChanged ? "opacity-0 pointer-events-none w-0 truncate p-0" : "opacity-100"}`}
        disabled={isPending || !hasChanged}
      >
        {isPending ? "Saving" : "Save"}
      </Button>
    </form>
  );
}
