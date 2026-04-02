import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center py-10 px-4">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
