"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { BottomNav } from "@/components/BottomNav";

const AUTH_PATHS = ["/login", "/signup"];
const ONBOARDING_PATH = "/onboarding";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, onboardingDone, isLoading } = useAuth();

  const isAuthPage = AUTH_PATHS.some((p) => pathname.startsWith(p));

  useEffect(() => {
    if (isLoading) return;
    if (!user && !isAuthPage) { router.replace("/login"); return; }
    if (user && !onboardingDone && pathname !== ONBOARDING_PATH) { router.replace(ONBOARDING_PATH); return; }
    if (user && onboardingDone && pathname === ONBOARDING_PATH) { router.replace("/"); return; }
  }, [user, onboardingDone, isLoading, isAuthPage, pathname, router]);

  // Desktop sidebar: show on all app pages except auth/onboarding/complete
  const showSidebar = !!(user && onboardingDone && !isAuthPage && pathname !== ONBOARDING_PATH && !pathname.startsWith("/complete"));

  // Mobile bottom nav: hide on deep routine sub-pages (they have their own back nav)
  const showBottomNav = !!(showSidebar && !pathname.startsWith("/routines/"));

  return (
    <div className={showSidebar ? "md:pl-56" : ""}>
      {children}
      {showSidebar && <BottomNav showSidebar={showSidebar} showBottomNav={showBottomNav} />}
    </div>
  );
}
