"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useSignIn } from "@clerk/react";
import { clerkErrorToMessage } from "@/features/auth/errors";
import { authLinks } from "@/lib/constants";

export function SubmitButton({
  loading,
  loadingLabel,
  children,
}: {
  loading: boolean;
  loadingLabel: string;
  children: ReactNode;
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-full bg-lp-ink text-[13px] font-medium tracking-[-0.01em] text-lp-paper transition-colors hover:bg-[color-mix(in_srgb,var(--lp-ink)_90%,var(--lp-paper))] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? (
        <>
          <span
            aria-hidden="true"
            className="h-4 w-4 animate-spin rounded-full border-2 border-lp-paper/20 border-t-lp-paper"
          />
          {loadingLabel}
        </>
      ) : (
        children
      )}
    </button>
  );
}

export function GoogleButton() {
  const { signIn } = useSignIn();
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const popupRef = useRef<Window | null>(null);
  const completedRef = useRef(false);
  const finalizingRef = useRef(false);

  const completeSignIn = useCallback(async () => {
    if (!signIn || finalizingRef.current) return;
    finalizingRef.current = true;
    completedRef.current = true;
    setLoading(true);
    const { error } = await signIn.finalize({
      navigate: async ({ decorateUrl }) => {
        const url = decorateUrl(authLinks.guestWorkspace);
        if (url.startsWith("http")) {
          window.location.href = url;
        } else {
          router.push(url);
        }
      },
    });
    if (error) {
      setError(clerkErrorToMessage(error) ?? "Google sign-in didn't complete. Please try again.");
      setLoading(false);
      finalizingRef.current = false;
    }
    popupRef.current?.close();
    popupRef.current = null;
  }, [signIn, router]);

  useEffect(() => {
    if (completedRef.current) return;
    if (!signIn || signIn.status !== "complete") return;
    const id = window.setTimeout(() => {
      void completeSignIn();
    }, 0);
    return () => window.clearTimeout(id);
  }, [signIn, completeSignIn]);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push(authLinks.guestWorkspace);
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (!loading) return;
    const id = window.setInterval(() => {
      const popup = popupRef.current;
      if (popup && popup.closed && !completedRef.current) {
        popupRef.current = null;
        setLoading(false);
        setError("Google sign-in was cancelled. Try again when you're ready.");
      }
    }, 400);
    return () => window.clearInterval(id);
  }, [loading]);

  async function handleClick() {
    if (!signIn || !isLoaded || loading || isSignedIn) return;
    setLoading(true);
    setError(null);
    completedRef.current = false;

    let popup: Window | null = null;
    try {
      popup = window.open("", "_blank", "width=520,height=640");
    } catch {
      popup = null;
    }
    if (popup) popupRef.current = popup;

    const { error } = await signIn.sso({
      strategy: "oauth_google",
      popup: popup ?? undefined,
      redirectUrl: authLinks.guestWorkspace,
      redirectCallbackUrl: authLinks.signUp,
    });

    if (error) {
      setError(clerkErrorToMessage(error) ?? "Google sign-in didn't complete. Please try again.");
      setLoading(false);
      popupRef.current?.close();
      popupRef.current = null;
      return;
    }

    if (signIn.status === "complete") {
      await completeSignIn();
    } else if (!popup) {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-full border border-lp-rule bg-lp-paper-2 text-[13px] font-medium tracking-[-0.01em] text-lp-ink shadow-[var(--lp-shadow-interactive)] transition-colors hover:border-[color-mix(in_srgb,var(--lp-ink)_20%,transparent)] hover:bg-lp-paper disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <span
              aria-hidden="true"
              className="h-4 w-4 animate-spin rounded-full border-2 border-lp-ink/20 border-t-lp-ink"
            />
            Connecting to Google…
          </>
        ) : (
          <>
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4">
              <path
                fill="currentColor"
                className="text-lp-ink"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                className="text-lp-ink/70"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                className="text-lp-ink/60"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                className="text-lp-ink/90"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </>
        )}
      </button>
      {error ? (
        <p aria-live="polite" className="mt-2 text-center text-xs font-medium text-lp-accent">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function OrDivider() {
  return (
    <div className="flex items-center gap-3">
      <span aria-hidden="true" className="h-px flex-1 bg-lp-rule" />
      <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-lp-ink-3">
        or
      </span>
      <span aria-hidden="true" className="h-px flex-1 bg-lp-rule" />
    </div>
  );
}
