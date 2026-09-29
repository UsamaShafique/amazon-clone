"use client";

import { useAuth } from "@/components/providers/AuthProvider";

export function AccountGreeting() {
  const { user } = useAuth();
  return (
    <div style={{ margin: "16px 0" }}>
      <h1 className="pageTitle" style={{ margin: 0 }}>
        Your Account
      </h1>
      {user && (
        <p className="muted" style={{ margin: "4px 0 0" }}>
          Hello, <strong>{user.name}</strong> ({user.email})
        </p>
      )}
    </div>
  );
}
