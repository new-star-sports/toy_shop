import { Button } from "@nss/ui/components/button";

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6 rounded-xl bg-nss-card p-8 shadow-lg border border-nss-border">
        {/* Logo */}
        <div className="text-center">
          <div className="w-14 h-14 mx-auto rounded-xl bg-nss-primary flex items-center justify-center mb-4">
            <span className="text-2xl text-white font-bold">★</span>
          </div>
          <h1 className="text-xl font-semibold text-nss-primary">NSS Admin</h1>
          <p className="text-sm text-nss-text-secondary mt-1">Sign in to your dashboard</p>
        </div>

        {/* Login form placeholder */}
        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-nss-text-primary mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="admin@newstarsports.com"
              className="w-full rounded-md border border-nss-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-nss-primary"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-nss-text-primary mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="w-full rounded-md border border-nss-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-nss-primary"
            />
          </div>
          <Button type="submit" className="w-full" size="lg">
            Sign In
          </Button>
        </form>
      </div>
    </main>
  );
}
