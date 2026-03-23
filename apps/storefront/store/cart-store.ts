import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CartItem {
  variantId: string;
  productId: string;
  slug: string;
  nameEn: string;
  nameAr: string;
  brandEn?: string;
  brandAr?: string;
  sku: string;
  image: string | null;
  price: number;
  compareAtPrice: number | null;
  quantity: number;
  stockQuantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  
  // Actions
  addItem: (item: Omit<CartItem, "quantity">, quantity: number) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  toggleDrawer: (open?: boolean) => void;
  
  // Getters
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item, quantity) => {
        const { items } = get();
        const existingItem = items.find((i) => i.variantId === item.variantId);

        if (existingItem) {
          const newQuantity = Math.min(existingItem.quantity + quantity, item.stockQuantity);
          set({
            items: items.map((i) =>
              i.variantId === item.variantId ? { ...i, quantity: newQuantity } : i
            ),
          });
        } else {
          set({ items: [...items, { ...item, quantity: Math.min(quantity, item.stockQuantity) }] });
        }
        
        // Open drawer on add
        set({ isOpen: true });
      },

      removeItem: (variantId) => {
        set({ items: get().items.filter((i) => i.variantId !== variantId) });
      },

      updateQuantity: (variantId, quantity) => {
        const { items } = get();
        const item = items.find((i) => i.variantId === variantId);
        if (!item) return;

        const newQuantity = Math.max(1, Math.min(quantity, item.stockQuantity));
        set({
          items: items.map((i) =>
            i.variantId === variantId ? { ...i, quantity: newQuantity } : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      toggleDrawer: (open) => set((state) => ({ isOpen: open ?? !state.isOpen })),

      getTotalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),

      getTotalPrice: () => get().items.reduce((total, item) => total + item.price * item.quantity, 0),
    }),
    {
      name: "nss-cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
