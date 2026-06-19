import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Sparkles, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getArticle } from "@/lib/blog-data";

export const Route = createFileRoute("/blog_/$slug")({
  loader: ({ params }) => {
    const article = getArticle(params.slug);
    if (!article) throw notFound();
    return { article };
  },
  head: ({ loaderData }) => {
    const a = loaderData?.article;
    return {
      meta: a
        ? [
            { title: `${a.title} — Ray Ecommerce Blog` },
            { name: "description", content: a.excerpt },
            { property: "og:title", content: a.title },
            { property: "og:description", content: a.excerpt },
            { property: "og:image", content: a.image },
          ]
        : [{ title: "Article — Ray Ecommerce Blog" }],
    };
  },
  notFoundComponent: ArticleNotFound,
  errorComponent: ArticleError,
  component: ArticlePage,
});

function ArticleNotFound() {
  return (
    <section className="py-24 text-center">
      <div className="mx-auto max-w-xl px-4">
        <h1 className="text-3xl font-bold">Article not found</h1>
        <p className="mt-3 text-muted-foreground">
          The article you're looking for doesn't exist or may have moved.
        </p>
        <Button asChild className="mt-6 rounded-full brand-gradient text-white">
          <Link to="/blog">
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to Blog
          </Link>
        </Button>
      </div>
    </section>
  );
}

function ArticleError() {
  return (
    <section className="py-24 text-center">
      <div className="mx-auto max-w-xl px-4">
        <h1 className="text-3xl font-bold">Something went wrong</h1>
        <Button asChild className="mt-6 rounded-full brand-gradient text-white">
          <Link to="/blog">
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to Blog
          </Link>
        </Button>
      </div>
    </section>
  );
}

function ArticlePage() {
  const { article } = Route.useLoaderData();

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 brand-gradient-soft" />
        <div className="mx-auto max-w-4xl px-4 lg:px-8 pt-14 md:pt-20 pb-10">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Blog
          </Link>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/80 border border-primary/20 backdrop-blur px-3 py-1 text-[10px] font-bold tracking-[0.2em] uppercase text-primary">
            <BookOpen className="h-3.5 w-3.5" /> {article.category}
          </div>
          <h1 className="mt-4 text-3xl md:text-5xl font-bold tracking-tight leading-[1.1]">
            {article.title}
          </h1>
          <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-3xl">
            {article.intro}
          </p>
        </div>
      </section>

      {/* IMAGE */}
      <section className="pb-6">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <div className="relative aspect-[16/8] overflow-hidden rounded-3xl border border-border bg-primary/5 shadow-[0_30px_80px_-40px_rgba(59,130,246,0.45)]">
            <img
              src={article.image}
              alt={article.imageAlt}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-10 md:py-14">
        <div className="mx-auto max-w-6xl px-4 lg:px-8 grid lg:grid-cols-3 gap-10">
          <article className="lg:col-span-2 rounded-3xl border border-border bg-white p-7 md:p-10 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.25)]">
            <div className="space-y-8">
              {article.sections.map((s: { heading: string; body: string }) => (
                <div key={s.heading}>
                  <h2 className="text-xl md:text-2xl font-bold tracking-tight">
                    {s.heading}
                  </h2>
                  <p className="mt-3 text-muted-foreground leading-relaxed">
                    {s.body}
                  </p>
                </div>
              ))}
            </div>
          </article>

          <aside className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-border bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.25)]">
              <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary">
                Article Summary
              </div>
              <h3 className="mt-2 text-base font-bold leading-snug">
                {article.title}
              </h3>
              <ul className="mt-4 space-y-2">
                {article.sections.map((s: { heading: string; body: string }) => (
                  <li key={s.heading} className="text-sm text-muted-foreground">
                    • {s.heading}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20 md:pb-24">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-white p-8 md:p-12 shadow-[0_30px_80px_-40px_rgba(59,130,246,0.45)]">
            <div className="absolute inset-0 -z-10 brand-gradient-soft opacity-70" />
            <div className="flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/70 px-4 py-1.5 text-xs font-bold tracking-[0.2em] uppercase text-primary">
                <Sparkles className="h-3.5 w-3.5" /> Get Started
              </div>
              <h2 className="mt-4 text-2xl md:text-3xl font-bold tracking-tight max-w-2xl">
                Ready to organize your marketplace growth?
              </h2>
              <p className="mt-3 text-muted-foreground max-w-xl">
                Talk with Ray Ecommerce about a setup, management, or growth
                plan that fits your store.
              </p>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                <Button asChild size="lg" className="rounded-full brand-gradient text-white btn-glow">
                  <Link to="/contact">
                    Book a Free Consultation <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full">
                  <Link to="/blog">Back to Blog</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
