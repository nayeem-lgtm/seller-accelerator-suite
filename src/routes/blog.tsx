import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ARTICLES,
  CATEGORIES,
  STORIES,
  type Category,
} from "@/lib/blog-data";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — Ray Ecommerce Marketplace Insights" },
      {
        name: "description",
        content:
          "Expert guidance, strategy, and practical insights for sellers building on Walmart Marketplace, TikTok Shop, and eBay.",
      },
      { property: "og:title", content: "Ray Ecommerce Blog — Marketplace Insights" },
      {
        property: "og:description",
        content:
          "Marketplace growth insights, seller success stories, and store management tips.",
      },
    ],
  }),
  component: BlogPage,
});

function BlogPage() {
  const [active, setActive] = useState<Category>("All");

  const featured = useMemo(() => ARTICLES.find((a) => a.featured) ?? ARTICLES[0], []);

  const filteredPosts = useMemo(() => {
    const nonFeatured = ARTICLES.filter((a) => !a.featured);
    if (active === "All") return nonFeatured;
    if (active === "Success Stories") return [];
    return nonFeatured.filter((p) => p.category === active);
  }, [active]);

  const showStories = active === "All" || active === "Success Stories";
  const showFeatured = active === "All" || active === featured.category;

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 brand-gradient-soft" />
        <div className="mx-auto max-w-7xl px-4 lg:px-8 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/70 backdrop-blur px-4 py-1.5 text-xs font-bold tracking-[0.2em] uppercase text-primary">
            <BookOpen className="h-3.5 w-3.5" /> Ray Ecommerce Insights
          </div>
          <h1 className="mt-4 text-4xl md:text-6xl font-bold tracking-tight max-w-4xl mx-auto leading-[1.05]">
            Marketplace{" "}
            <span className="bg-clip-text text-transparent brand-gradient">
              Growth Insights
            </span>
          </h1>
          <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Expert guidance, strategy, and practical insights for sellers
            building on Walmart Marketplace, TikTok Shop, and eBay.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="rounded-full brand-gradient text-white btn-glow">
              <Link to="/pricing">
                View Plans <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CATEGORY CHIPS */}
      <section className="py-6">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {CATEGORIES.map((c) => {
              const isActive = active === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setActive(c)}
                  className={`rounded-full px-4 py-2 text-xs md:text-sm font-semibold border transition-all ${
                    isActive
                      ? "bg-primary text-white border-primary shadow-[0_10px_30px_-12px_rgba(59,130,246,0.55)]"
                      : "bg-white text-foreground/70 border-border hover:border-primary/40 hover:text-primary"
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEATURED */}
      {showFeatured && (
        <section className="py-10 md:py-14">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <article className="group relative overflow-hidden rounded-3xl border border-border bg-white shadow-[0_30px_80px_-40px_rgba(59,130,246,0.45)] transition-all hover:-translate-y-0.5">
              <div className="grid md:grid-cols-5">
                <div className="md:col-span-2 relative overflow-hidden min-h-[220px] md:min-h-[320px] bg-primary/5">
                  <img
                    src={featured.image}
                    alt={featured.imageAlt}
                    width={1280}
                    height={768}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 via-transparent to-transparent mix-blend-multiply" />
                </div>
                <div className="md:col-span-3 p-7 md:p-10">
                  <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold tracking-[0.2em] uppercase text-primary">
                    Featured · {featured.category}
                  </div>
                  <h2 className="mt-4 text-2xl md:text-3xl font-bold tracking-tight leading-tight">
                    {featured.title}
                  </h2>
                  <p className="mt-3 text-muted-foreground">{featured.excerpt}</p>
                  <div className="mt-6">
                    <Button asChild className="rounded-full brand-gradient text-white btn-glow">
                      <Link to="/blog/$slug" params={{ slug: featured.slug }}>
                        Read Article <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </section>
      )}

      {/* SUCCESS STORIES */}
      {showStories && (
        <section className="py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="mb-10 text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white px-4 py-1.5 text-xs font-bold tracking-[0.2em] uppercase text-primary">
                <Trophy className="h-3.5 w-3.5" /> Seller Progress Stories
              </div>
              <h2 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">
                Realistic Growth Journeys, Built With Structure
              </h2>
              <p className="mt-3 text-muted-foreground">
                See how sellers can move from confusion to a more organized
                marketplace operation with the right setup, management process,
                and professional support.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
              {STORIES.map((s) => (
                <article
                  key={s.slug}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-white transition-all hover:-translate-y-1 hover:shadow-[0_25px_60px_-30px_rgba(59,130,246,0.5)] hover:border-primary/40"
                >
                  <div className="relative aspect-[16/9] overflow-hidden bg-primary/5">
                    <img
                      src={s.image}
                      alt={s.imageAlt}
                      width={1280}
                      height={720}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                    <span className="absolute left-4 top-4 rounded-full bg-white/95 backdrop-blur px-3 py-1 text-[10px] font-bold tracking-[0.18em] uppercase text-primary shadow-sm">
                      {s.platform}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6 md:p-7">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                        <s.Icon className="h-5 w-5" />
                      </span>
                      <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-muted-foreground">
                        Seller Progress Story
                      </span>
                    </div>
                    <h3 className="mt-4 text-lg md:text-xl font-bold leading-snug">
                      {s.title}
                    </h3>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed flex-1">
                      {s.excerpt}
                    </p>
                    <div className="mt-5">
                      <Link
                        to="/blog/stories/$slug"
                        params={{ slug: s.slug }}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all"
                      >
                        Read Story <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* BLOG GRID */}
      {filteredPosts.length > 0 && (
        <section className="py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="mb-10 max-w-3xl">
              <div className="text-xs font-semibold tracking-[0.18em] uppercase text-primary mb-3">
                Latest Articles
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Insights, strategy, and seller guidance
              </h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((p) => (
                <article
                  key={p.slug}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-white transition-all hover:-translate-y-1 hover:shadow-[0_25px_60px_-30px_rgba(59,130,246,0.5)] hover:border-primary/40"
                >
                  <div className="relative aspect-[16/9] overflow-hidden bg-primary/5">
                    <img
                      src={p.image}
                      alt={p.imageAlt}
                      width={1280}
                      height={720}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-white/95 backdrop-blur px-2.5 py-1 text-[10px] font-bold tracking-[0.18em] uppercase text-primary shadow-sm">
                      {p.category}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-lg font-bold leading-snug group-hover:text-primary transition-colors">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1">
                      {p.excerpt}
                    </p>
                    <div className="mt-5">
                      <Link
                        to="/blog/$slug"
                        params={{ slug: p.slug }}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all"
                      >
                        Read Article <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-white p-8 md:p-12 shadow-[0_30px_80px_-40px_rgba(59,130,246,0.45)]">
            <div className="absolute inset-0 -z-10 brand-gradient-soft opacity-70" />
            <div className="flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/70 px-4 py-1.5 text-xs font-bold tracking-[0.2em] uppercase text-primary">
                <Sparkles className="h-3.5 w-3.5" /> Get Started
              </div>
              <h2 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight max-w-2xl">
                Ready to Build Your Marketplace Presence?
              </h2>
              <p className="mt-3 text-muted-foreground max-w-xl">
                Explore Ray Ecommerce plans and choose the right support level
                for your Walmart, TikTok Shop, or eBay growth journey.
              </p>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                <Button asChild size="lg" className="rounded-full brand-gradient text-white btn-glow">
                  <Link to="/pricing">
                    View Plans <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full">
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
