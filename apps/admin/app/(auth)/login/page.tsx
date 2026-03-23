import { LoginForm } from "./_components/login-form";

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

        <LoginForm />
      </div>
    </main>
  );
}
