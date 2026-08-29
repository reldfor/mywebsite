"use client";

import type { ReactNode } from "react";
import { ClerkProvider as ClerkProviderBase } from "@clerk/nextjs";

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export function ClerkProvider({ children }: { children: ReactNode }) {
  return (
    <ClerkProviderBase publishableKey={publishableKey || undefined}>
      {children}
    </ClerkProviderBase>
  );
}

