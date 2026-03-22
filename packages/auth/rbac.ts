/**
 * NewStarSports — Role-Based Access Control (RBAC)
 *
 * Roles hierarchy:
 *   super_admin > manager > editor | fulfillment | support
 */

export const ROLES = {
  SUPER_ADMIN: "super_admin",
  MANAGER: "manager",
  EDITOR: "editor",
  FULFILLMENT: "fulfillment",
  SUPPORT: "support",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

/** Permission matrix — maps pages to allowed roles */
const PERMISSIONS: Record<string, Role[]> = {
  // Full access
  dashboard: [ROLES.SUPER_ADMIN, ROLES.MANAGER, ROLES.EDITOR, ROLES.FULFILLMENT, ROLES.SUPPORT],

  // Product management
  "products.view": [ROLES.SUPER_ADMIN, ROLES.MANAGER, ROLES.EDITOR, ROLES.FULFILLMENT, ROLES.SUPPORT],
  "products.create": [ROLES.SUPER_ADMIN, ROLES.MANAGER, ROLES.EDITOR],
  "products.edit": [ROLES.SUPER_ADMIN, ROLES.MANAGER, ROLES.EDITOR],
  "products.delete": [ROLES.SUPER_ADMIN, ROLES.MANAGER],

  // Orders
  "orders.view": [ROLES.SUPER_ADMIN, ROLES.MANAGER, ROLES.EDITOR, ROLES.FULFILLMENT, ROLES.SUPPORT],
  "orders.manage": [ROLES.SUPER_ADMIN, ROLES.MANAGER, ROLES.FULFILLMENT],

  // Customers
  "customers.view": [ROLES.SUPER_ADMIN, ROLES.MANAGER, ROLES.SUPPORT],
  "customers.manage": [ROLES.SUPER_ADMIN, ROLES.MANAGER],

  // Categories
  "categories.manage": [ROLES.SUPER_ADMIN, ROLES.MANAGER, ROLES.EDITOR],

  // Inventory
  "inventory.manage": [ROLES.SUPER_ADMIN, ROLES.MANAGER, ROLES.FULFILLMENT],

  // Banners & promotions
  "banners.manage": [ROLES.SUPER_ADMIN, ROLES.MANAGER, ROLES.EDITOR],
  "coupons.manage": [ROLES.SUPER_ADMIN, ROLES.MANAGER],

  // Reviews
  "reviews.manage": [ROLES.SUPER_ADMIN, ROLES.MANAGER, ROLES.SUPPORT],

  // Analytics
  "analytics.view": [ROLES.SUPER_ADMIN, ROLES.MANAGER],

  // Shipping
  "shipping.manage": [ROLES.SUPER_ADMIN, ROLES.MANAGER],

  // Returns
  "returns.manage": [ROLES.SUPER_ADMIN, ROLES.MANAGER, ROLES.EDITOR, ROLES.FULFILLMENT, ROLES.SUPPORT],

  // Blog
  "blog.manage": [ROLES.SUPER_ADMIN, ROLES.MANAGER, ROLES.EDITOR],

  // Staff — super admin only
  "staff.manage": [ROLES.SUPER_ADMIN],

  // Audit log
  "audit.view": [ROLES.SUPER_ADMIN],

  // Settings
  "settings.manage": [ROLES.SUPER_ADMIN],
};

/**
 * Check if a role has a specific permission.
 */
export function hasPermission(role: Role, permission: string): boolean {
  const allowedRoles = PERMISSIONS[permission];
  if (!allowedRoles) return false;
  return allowedRoles.includes(role);
}

/**
 * Check if a role can access a specific admin route.
 */
export function canAccessRoute(role: Role, route: string): boolean {
  // Map routes to permissions
  const routePermissionMap: Record<string, string> = {
    "/admin/products": "products.view",
    "/admin/products/new": "products.create",
    "/admin/orders": "orders.view",
    "/admin/customers": "customers.view",
    "/admin/categories": "categories.manage",
    "/admin/inventory": "inventory.manage",
    "/admin/banners": "banners.manage",
    "/admin/coupons": "coupons.manage",
    "/admin/reviews": "reviews.manage",
    "/admin/analytics": "analytics.view",
    "/admin/shipping": "shipping.manage",
    "/admin/returns": "returns.manage",
    "/admin/blog": "blog.manage",
    "/admin/staff": "staff.manage",
    "/admin/audit-log": "audit.view",
    "/admin/settings": "settings.manage",
  };

  // Dashboard is accessible to all roles
  if (route === "/admin" || route === "/admin/") {
    return true;
  }

  // Find matching permission
  const matchedRoute = Object.keys(routePermissionMap)
    .sort((a, b) => b.length - a.length) // Longest match first
    .find((r) => route.startsWith(r));

  if (!matchedRoute) return true; // Unknown route — allow by default
  return hasPermission(role, routePermissionMap[matchedRoute]!);
}
