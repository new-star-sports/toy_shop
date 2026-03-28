import { LoginForm } from "./_components/login-form";

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 p-6">
      <div className="w-full max-w-sm space-y-6 rounded-2xl bg-card p-8 shadow-xl border border-border/60">
        {/* Logo */}
        <div className="text-center">
          <div className="w-14 h-14 mx-auto rounded-xl bg-primary flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
            <span className="text-2xl text-white font-bold">★</span>
          </div>
          <h1 className="text-2xl font-bold text-primary">Admin</h1>
          <p className="text-sm text-foreground/60 mt-1">Sign in to your dashboard</p>
        </div>

        <LoginForm />
      </div>
    </main>
  );
}
