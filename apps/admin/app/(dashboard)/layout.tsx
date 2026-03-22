export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-e border-nss-border bg-nss-card">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-nss-border">
          <div className="w-8 h-8 rounded-lg bg-nss-primary flex items-center justify-center">
            <span className="text-sm text-white font-bold">★</span>
          </div>
          <span className="font-semibold text-nss-primary">NSS Admin</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {[
            { label: "Dashboard", href: "/", icon: "📊" },
            { label: "Products", href: "/products", icon: "📦" },
            { label: "Orders", href: "/orders", icon: "🛒" },
            { label: "Customers", href: "/customers", icon: "👥" },
            { label: "Categories", href: "/categories", icon: "📂" },
            { label: "Inventory", href: "/inventory", icon: "📋" },
            { label: "Banners", href: "/banners", icon: "🖼️" },
            { label: "Coupons", href: "/coupons", icon: "🎫" },
            { label: "Reviews", href: "/reviews", icon: "⭐" },
            { label: "Analytics", href: "/analytics", icon: "📈" },
            { label: "Shipping", href: "/shipping", icon: "🚚" },
            { label: "Returns", href: "/returns", icon: "↩️" },
            { label: "Blog", href: "/blog", icon: "📝" },
            { label: "Settings", href: "/settings", icon: "⚙️" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-nss-text-secondary hover:bg-nss-surface hover:text-nss-text-primary transition-colors"
            >
              <span>{item.icon}</span>
              {item.label}
            </a>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-nss-border bg-nss-card">
          <h2 className="text-lg font-semibold text-nss-text-primary">Dashboard</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-nss-text-secondary">Admin User</span>
            <div className="w-8 h-8 rounded-full bg-nss-primary flex items-center justify-center">
              <span className="text-xs text-white font-medium">A</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
