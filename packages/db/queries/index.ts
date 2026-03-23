export { getProducts, getProductBySlug, getNewArrivals, getFlashSaleProducts, getHomepageFeatured } from "./products";
export type { ProductCard, ProductWithRelations } from "./products";

export { getCategories, getCategoryBySlug, getCategoryTree, getHomepagePinnedCategories } from "./categories";
export type { CategoryWithChildren } from "./categories";

export { getBrands, getBrandBySlug, getFeaturedBrands } from "./brands";

export { getHeroBanners, getAnnouncementBar, getEditorialBanner, getPromoBanners } from "./banners";

export { getSetting, getSettings } from "./settings";
export type {
  StoreInfoSettings,
  TrustBarSettings,
  AnnouncementBarSettings,
  ShippingSettings,
  LoyaltySettings,
  PaymentMethodSettings,
} from "./settings";

export {
  getUserAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
  getGovernorates,
  getAreasByGovernorate,
  unsetOtherDefaultAddresses,
} from "./addresses";

export { getOrderByNumber, getUserOrders, getOrderDetails } from "./orders";
