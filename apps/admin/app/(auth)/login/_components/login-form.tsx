"use client";

import { useState } from "react";
import { Button } from "@nss/ui/components/button";
import { Input } from "@nss/ui/components/input";
import { Label } from "@nss/ui/components/label";
import { signInAction } from "../_actions";

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await signInAction(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg font-medium">
          {error}
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-semibold text-foreground">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="admin@newstarsports.com"
          required
          disabled={loading}
          className="h-11 bg-background border-border text-foreground placeholder:text-foreground/40"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-semibold text-foreground">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
          disabled={loading}
          className="h-11 bg-background border-border text-foreground placeholder:text-foreground/40"
        />
      </div>
      <Button type="submit" className="w-full h-11 text-sm font-semibold" size="lg" disabled={loading}>
        {loading ? "Signing In..." : "Sign In"}
      </Button>
    </form>
  );
}
