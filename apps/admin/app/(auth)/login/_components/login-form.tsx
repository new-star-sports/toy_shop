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
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-nss-danger/10 border border-nss-danger/20 text-nss-danger text-sm rounded-lg">
          {error}
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="admin@newstarsports.com"
          required
          disabled={loading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
          disabled={loading}
        />
      </div>
      <Button type="submit" className="w-full" size="lg" disabled={loading}>
        {loading ? "Signing In..." : "Sign In"}
      </Button>
    </form>
  );
}
