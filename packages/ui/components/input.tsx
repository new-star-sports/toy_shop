import * as React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className = "", type, ...props }: InputProps) {
  return (
    <input
      type={type}
      className={`flex h-10 w-full rounded-lg border border-nss-border bg-nss-surface px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-nss-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nss-primary/20 focus-visible:border-nss-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all ${className}`}
      {...props}
    />
  );
}
