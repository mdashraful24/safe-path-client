"use client";

import type { ReactNode } from "react";
import GoogleAuthProvider from "./google-auth.provider";
import QueryProviders from "./query.provider";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <GoogleAuthProvider>
      <QueryProviders>{children}</QueryProviders>
    </GoogleAuthProvider>
  );
}
