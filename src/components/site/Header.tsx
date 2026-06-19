import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Menu, X, User as UserIcon, LogOut, LayoutDashboard, ChevronDown, Store, Tv, ShoppingBag } from "lucide-react";
import logoAsset from "@/assets/ray-logo.asset.json";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const SERVICE_LINKS: { to: string; label: string; description: string; Icon: typeof Store }[] = [
  { to: "/walmart", label: "Walmart", description: "Walmart Marketplace store launch & operations", Icon: Store },
  { to: "/tiktok-shop", label: "TikTok Shop", description: "Social commerce setup & growth", Icon: Tv },
  { to: "/ebay", label: "eBay", description: "Beginner-friendly marketplace operations", Icon: ShoppingBag },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const aboutCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function openServices() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setServicesOpen(true);
  }
  function scheduleCloseServices() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setServicesOpen(false), 120);
  }
  function openAbout() {
    if (aboutCloseTimer.current) clearTimeout(aboutCloseTimer.current);
    setAboutOpen(true);
  }
  function scheduleCloseAbout() {
    if (aboutCloseTimer.current) clearTimeout(aboutCloseTimer.current);
    aboutCloseTimer.current = setTimeout(() => setAboutOpen(false), 120);
  }

  async function handleLogout() {
    await signOut();
    toast.success("Logged out");
    navigate({ to: "/" });
  }

  const ctaTo = user ? "/dashboard" : "/signup";
  const ctaLabel = user ? "Go to Dashboard" : "Sign Up";

  const navLinkBase = "px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors";

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-border shadow-[0_4px_24px_-12px_rgba(59,130,246,0.25)]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-8">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src={logoAsset.url} alt="Ray Ecommerce" className="h-6 md:h-7 w-auto object-contain" />
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          <Link to="/" className={navLinkBase} activeProps={{ className: "text-primary" }} activeOptions={{ exact: true }}>
            Home
          </Link>

          {/* Services dropdown */}
          <div
            className="relative"
            onMouseEnter={openServices}
            onMouseLeave={scheduleCloseServices}
          >
            <button
              type="button"
              onClick={() => setServicesOpen((v) => !v)}
              className={`${navLinkBase} inline-flex items-center gap-1 rounded-md ${servicesOpen ? "text-primary" : ""}`}
              aria-haspopup="true"
              aria-expanded={servicesOpen}
            >
              Services
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${servicesOpen ? "rotate-180" : ""}`} />
            </button>

            <div
              className={`absolute left-1/2 top-full -translate-x-1/2 pt-3 transition-all duration-200 ${
                servicesOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-1 pointer-events-none"
              }`}
              onMouseEnter={openServices}
              onMouseLeave={scheduleCloseServices}
            >
              <div className="w-[320px] rounded-2xl border border-border bg-white shadow-[0_20px_60px_-20px_rgba(15,23,42,0.25)] p-2">
                <div className="px-3 py-2 text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground">
                  Platforms We Manage
                </div>
                <div className="space-y-1">
                  {SERVICE_LINKS.map((s) => (
                    <Link
                      key={s.to}
                      to={s.to as never}
                      onClick={() => setServicesOpen(false)}
                      className="group flex items-start gap-3 rounded-xl p-3 hover:bg-primary/[0.06] transition-colors"
                    >
                      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                        <s.Icon className="h-4 w-4" />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                          {s.label}
                        </span>
                        <span className="block text-xs text-muted-foreground mt-0.5">{s.description}</span>
                      </span>
                    </Link>
                  ))}
                </div>
                <div className="mt-1 border-t border-border pt-1">
                  <Link
                    to="/services"
                    onClick={() => setServicesOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-primary hover:bg-primary/[0.06] transition-colors"
                  >
                    View all services
                    <span aria-hidden>→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <Link to="/pricing" className={navLinkBase} activeProps={{ className: "text-primary" }}>Plans</Link>

          <Link to="/blog" className={navLinkBase} activeProps={{ className: "text-primary" }}>Blog</Link>

          {/* About dropdown */}
          <div
            className="relative"
            onMouseEnter={openAbout}
            onMouseLeave={scheduleCloseAbout}
          >
            <button
              type="button"
              onClick={() => setAboutOpen((v) => !v)}
              className={`${navLinkBase} inline-flex items-center gap-1 rounded-md ${aboutOpen ? "text-primary" : ""}`}
              aria-haspopup="true"
              aria-expanded={aboutOpen}
            >
              About
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${aboutOpen ? "rotate-180" : ""}`} />
            </button>
            <div
              className={`absolute left-1/2 top-full -translate-x-1/2 pt-3 transition-all duration-200 ${
                aboutOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-1 pointer-events-none"
              }`}
              onMouseEnter={openAbout}
              onMouseLeave={scheduleCloseAbout}
            >
              <div className="w-[220px] rounded-2xl border border-border bg-white shadow-[0_20px_60px_-20px_rgba(15,23,42,0.25)] p-2">
                <Link
                  to="/about"
                  onClick={() => setAboutOpen(false)}
                  className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-foreground hover:bg-primary/[0.06] hover:text-primary transition-colors"
                >
                  About
                </Link>
                <Link
                  to="/faq"
                  onClick={() => setAboutOpen(false)}
                  className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-foreground hover:bg-primary/[0.06] hover:text-primary transition-colors"
                >
                  FAQ
                </Link>
              </div>
            </div>
          </div>

          <Link to="/contact" className={navLinkBase} activeProps={{ className: "text-primary" }}>Contact Us</Link>
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5 text-sm font-medium hover:border-primary/40 transition-colors">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <UserIcon className="h-3.5 w-3.5" />
                  </span>
                  <span className="max-w-[140px] truncate">{user.email}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="truncate">{user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="flex items-center gap-2 w-full">
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                  <LogOut className="h-4 w-4 mr-2" /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login" className="text-sm font-medium px-3 py-2 text-foreground/80 hover:text-primary transition-colors">
              Login
            </Link>
          )}
          <Button asChild className="btn-glow brand-gradient text-white rounded-full px-5">
            <Link to={ctaTo}>{ctaLabel}</Link>
          </Button>
        </div>

        <button
          aria-label="Toggle menu"
          className="lg:hidden p-2 rounded-md hover:bg-accent"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-border">
          <nav className="flex flex-col px-4 py-3 gap-1">
            <Link to="/" onClick={() => setOpen(false)} className="px-3 py-3 rounded-lg text-sm font-medium hover:bg-accent">Home</Link>

            <button
              type="button"
              onClick={() => setMobileServicesOpen((v) => !v)}
              className="flex items-center justify-between px-3 py-3 rounded-lg text-sm font-medium hover:bg-accent"
              aria-expanded={mobileServicesOpen}
            >
              <span>Services</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${mobileServicesOpen ? "rotate-180" : ""}`} />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${mobileServicesOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
            >
              <div className="ml-2 mb-1 mt-0.5 space-y-1 border-l border-border pl-3">
                {SERVICE_LINKS.map((s) => (
                  <Link
                    key={s.to}
                    to={s.to as never}
                    onClick={() => { setOpen(false); setMobileServicesOpen(false); }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/[0.06] hover:text-primary"
                  >
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <s.Icon className="h-4 w-4" />
                    </span>
                    {s.label}
                  </Link>
                ))}
                <Link
                  to="/services"
                  onClick={() => { setOpen(false); setMobileServicesOpen(false); }}
                  className="block px-3 py-2 rounded-lg text-sm font-semibold text-primary hover:bg-primary/[0.06]"
                >
                  View all services →
                </Link>
              </div>
            </div>

            <Link to="/pricing" onClick={() => setOpen(false)} className="px-3 py-3 rounded-lg text-sm font-medium hover:bg-accent">Plans</Link>

            <Link to="/blog" onClick={() => setOpen(false)} className="px-3 py-3 rounded-lg text-sm font-medium hover:bg-accent">Blog</Link>

            <button
              type="button"
              onClick={() => setMobileAboutOpen((v) => !v)}
              className="flex items-center justify-between px-3 py-3 rounded-lg text-sm font-medium hover:bg-accent"
              aria-expanded={mobileAboutOpen}
            >
              <span>About</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${mobileAboutOpen ? "rotate-180" : ""}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${mobileAboutOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}>
              <div className="ml-2 mb-1 mt-0.5 space-y-1 border-l border-border pl-3">
                <Link to="/about" onClick={() => { setOpen(false); setMobileAboutOpen(false); }} className="block px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/[0.06] hover:text-primary">About</Link>
                <Link to="/faq" onClick={() => { setOpen(false); setMobileAboutOpen(false); }} className="block px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/[0.06] hover:text-primary">FAQ</Link>
              </div>
            </div>

            <Link to="/contact" onClick={() => setOpen(false)} className="px-3 py-3 rounded-lg text-sm font-medium hover:bg-accent">Contact Us</Link>

            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setOpen(false)} className="px-3 py-3 rounded-lg text-sm font-medium hover:bg-accent">
                  Dashboard
                </Link>
                <button
                  onClick={() => { setOpen(false); handleLogout(); }}
                  className="text-left px-3 py-3 rounded-lg text-sm font-medium text-destructive hover:bg-accent"
                >
                  Log out
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setOpen(false)} className="px-3 py-3 rounded-lg text-sm font-medium hover:bg-accent">
                Login
              </Link>
            )}
            <Button asChild className="mt-2 brand-gradient text-white rounded-full" onClick={() => setOpen(false)}>
              <Link to={ctaTo}>{ctaLabel}</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
