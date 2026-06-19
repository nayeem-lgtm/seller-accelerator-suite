import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteHeader } from "@/components/site/Header";
import { SiteFooter } from "@/components/site/Footer";
import { RayAI } from "@/components/site/RayAI";
import { AuthProvider } from "@/hooks/useAuth";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">The page you're looking for doesn't exist.</p>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-full brand-gradient px-5 py-2.5 text-sm font-medium text-white">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold text-foreground">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Something went wrong on our end.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }} className="rounded-full brand-gradient text-white px-4 py-2 text-sm font-medium">Try again</button>
          <a href="/" className="rounded-full border border-input bg-background px-4 py-2 text-sm font-medium">Go home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Ray Ecommerce | Walmart & Managed eCommerce Operations" },
      { name: "description", content: "Ray Ecommerce helps entrepreneurs launch and manage Walmart Marketplace, TikTok Shop, and eBay stores with professional marketplace operations, transparent reporting, and hands-free support." },
      { name: "author", content: "Ray Ecommerce" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "Ray Ecommerce | Walmart & Managed eCommerce Operations" },
      { name: "twitter:title", content: "Ray Ecommerce | Walmart & Managed eCommerce Operations" },
      { property: "og:description", content: "Ray Ecommerce helps entrepreneurs launch and manage Walmart Marketplace, TikTok Shop, and eBay stores with professional marketplace operations, transparent reporting, and hands-free support." },
      { name: "twitter:description", content: "Ray Ecommerce helps entrepreneurs launch and manage Walmart Marketplace, TikTok Shop, and eBay stores with professional marketplace operations, transparent reporting, and hands-free support." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/f22db3ef-bc83-437c-907f-f0134b49cadf/id-preview-c781c1c2--60b98c10-13ec-4cf8-952a-71d66569daaa.lovable.app-1781649077886.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/f22db3ef-bc83-437c-907f-f0134b49cadf/id-preview-c781c1c2--60b98c10-13ec-4cf8-952a-71d66569daaa.lovable.app-1781649077886.png" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="min-h-screen flex flex-col">
          <SiteHeader />
          <main className="flex-1">
            <Outlet />
          </main>
          <SiteFooter />
        </div>
        <RayAI />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}
