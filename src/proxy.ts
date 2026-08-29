import { clerkMiddleware } from "@clerk/nextjs/server";

const hasClerkKeys =
  !!process.env.CLERK_SECRET_KEY && !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

const clerkProxy = hasClerkKeys ? clerkMiddleware() : undefined;

if (!hasClerkKeys) {
  console.warn("[proxy] Missing Clerk keys – auth disabled (set CLERK_SECRET_KEY / NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY on Vercel)");
}

export default clerkProxy ?? (() => undefined);

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
