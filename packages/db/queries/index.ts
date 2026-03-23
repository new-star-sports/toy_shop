export { getProducts, getProductBySlug, getNewArrivals, getFlashSaleProducts, getHomepageFeatured, getAdminProducts, getAdminProductById, updateStock } from "./products";
export type { ProductCard, ProductWithRelations } from "./products";

export { getCategories, getCategoryBySlug, getCategoryTree, getHomepagePinnedCategories } from "./categories";
export type { CategoryWithChildren } from "./categories";

export { getBrands, getBrandBySlug, getFeaturedBrands } from "./brands";

export { getHeroBanners, getAnnouncementBar, getEditorialBanner, getPromoBanners, getAdminBanners, getAdminBannerById } from "./banners";

export { getSetting, getSettings, updateSetting } from "./settings";
export type {
  StoreInfoSettings,
  TrustBarSettings,
  AnnouncementBarSettings,
  ShippingSettings,
  LoyaltySettings,
  PaymentMethodSettings,
  FlashSaleSettings,
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

export { getOrderByNumber, getUserOrders, getOrderDetails, getAdminOrders, updateOrderStatus, addOrderTimelineEvent } from "./orders";
export { getAdminCustomers, getAdminCustomerById } from "./customers";
export type { CustomerWithStats } from "./customers";

export { getDashboardStats } from "./dashboard";

export { 
  getAdminCoupons, 
  getAdminCouponById, 
  getCouponByCode, 
  upsertCoupon, 
  deleteCoupon, 
  incrementCouponUsage 
} from "./coupons";

export { 
  getAdminReviews, 
  updateReviewStatus, 
  toggleReviewPin, 
  saveReviewReply, 
  deleteReview 
} from "./reviews";

export {
  getBlogs,
  getBlogBySlug,
  getBlogById,
  getBlogCategories
} from "./blog";
export type { Blog, BlogCategory } from "./blog";
