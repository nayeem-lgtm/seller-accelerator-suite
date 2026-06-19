import {
  Store,
  Tv,
  ShoppingBag,
  Settings,
  TrendingUp,
  Layers,
  Megaphone,
  BarChart3,
  type LucideIcon,
} from "lucide-react";
import featuredImg from "@/assets/blog/featured-marketplace-growth.jpg";
import walmartSetupImg from "@/assets/blog/walmart-setup.jpg";
import tiktokSocialImg from "@/assets/blog/tiktok-social-commerce.jpg";
import ebayManagementImg from "@/assets/blog/ebay-management.jpg";
import storeManagementImg from "@/assets/blog/store-management.jpg";
import pricingPlansImg from "@/assets/blog/pricing-plans.jpg";
import accountControlImg from "@/assets/blog/account-control.jpg";
import successWalmartImg from "@/assets/blog/success-walmart-setup.jpg";
import successTiktokImg from "@/assets/blog/success-tiktok.jpg";
import successEbayImg from "@/assets/blog/success-ebay.jpg";
import successWorkflowImg from "@/assets/blog/success-workflow.jpg";

export const CATEGORIES = [
  "All",
  "Walmart Marketplace",
  "TikTok Shop",
  "eBay",
  "Store Management",
  "Seller Growth",
  "Ad Management",
  "Success Stories",
] as const;

export type Category = (typeof CATEGORIES)[number];

export type Section = { heading: string; body: string };

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  category: Category;
  Icon: LucideIcon;
  image: string;
  imageAlt: string;
  featured?: boolean;
  intro: string;
  sections: Section[];
};

export type Story = {
  slug: string;
  title: string;
  excerpt: string;
  platform: string;
  Icon: LucideIcon;
  image: string;
  imageAlt: string;
  intro: string;
  challenge: string;
  organized: string[];
  improvements: string[];
  outcome: string;
};

export const FEATURED_SLUG = "stronger-marketplace-presence-2026";

export const ARTICLES: Article[] = [
  {
    slug: FEATURED_SLUG,
    title: "How Sellers Can Build a Stronger Marketplace Presence in 2026",
    excerpt:
      "Learn how structured setup, clean store management, product research, and consistent reporting can help sellers build a more professional marketplace foundation.",
    category: "Seller Growth",
    Icon: TrendingUp,
    image: featuredImg,
    imageAlt: "Marketplace growth dashboard for ecommerce sellers",
    featured: true,
    intro:
      "Marketplaces in 2026 reward sellers who operate with structure. The sellers who grow consistently are the ones who treat their store as a real business — not a side experiment. This guide walks through the foundations that help sellers build a more professional, more trusted marketplace presence.",
    sections: [
      {
        heading: "Structure Before Scale",
        body:
          "Before chasing volume, focus on the foundation: clean business information, organized product data, defined fulfillment process, and clear reporting habits. Scaling on top of a messy base only multiplies problems.",
      },
      {
        heading: "Store Setup Quality",
        body:
          "Account readiness, brand presentation, accurate categories, and complete policies signal professionalism to both the marketplace and the buyer. Take the time to get this right once instead of patching it later.",
      },
      {
        heading: "Product Research",
        body:
          "Research is not optional. Understand demand, competition, pricing windows, and category requirements before listing. Sellers who research first ship cleaner listings and avoid expensive missteps.",
      },
      {
        heading: "Listing Optimization",
        body:
          "Titles, images, bullets, and attributes should follow each marketplace's guidelines. Optimized listings improve discoverability and reduce the back-and-forth of compliance edits.",
      },
      {
        heading: "Reporting and Management",
        body:
          "Weekly check-ins on sales, inventory, returns, and account health turn data into decisions. A simple, consistent reporting rhythm beats a complex one no one keeps up with.",
      },
      {
        heading: "Marketplace Compliance Awareness",
        body:
          "Policies change. Stay current on category rules, listing requirements, and seller performance standards on every platform you sell on.",
      },
      {
        heading: "Where Ray Ecommerce Fits In",
        body:
          "Ray Ecommerce supports sellers as a professional management partner — helping organize setup, listings, and ongoing operations while the seller stays in full ownership of their account.",
      },
    ],
  },
  {
    slug: "walmart-marketplace-readiness-checklist",
    title: "Walmart Marketplace Readiness: What Sellers Should Organize First",
    excerpt:
      "A strong Walmart Marketplace foundation starts with proper readiness, account structure, product planning, and listing quality.",
    category: "Walmart Marketplace",
    Icon: Store,
    image: walmartSetupImg,
    imageAlt: "Walmart Marketplace seller setup and product listing process",
    intro:
      "Walmart Marketplace rewards sellers who come prepared. Before applying or launching, organize the pieces below so your application, listings, and operations move forward smoothly.",
    sections: [
      {
        heading: "Business Information Readiness",
        body:
          "Have your business documents, tax details, banking information, and contact data ready and consistent across every form. Mismatched details slow everything down.",
      },
      {
        heading: "Product Category Planning",
        body:
          "Choose categories that match your actual catalog and your fulfillment capability. Not every category fits every seller — pick where you can compete and operate well.",
      },
      {
        heading: "Listing Quality",
        body:
          "Walmart expects clean titles, accurate attributes, high-quality images, and complete content. Prepare your listing data before upload, not during.",
      },
      {
        heading: "Fulfillment Preparation",
        body:
          "Decide how you will ship, how quickly, and how you will handle returns. Reliable fulfillment is one of the strongest signals of a serious seller.",
      },
      {
        heading: "Account Management Expectations",
        body:
          "Plan for ongoing tasks: performance monitoring, case responses, inventory updates, and price reviews. Walmart is not a set-and-forget marketplace.",
      },
      {
        heading: "Professional Support",
        body:
          "Ray Ecommerce can help organize and structure this readiness process. We do not guarantee approval — we help you present a stronger, better-organized seller foundation.",
      },
    ],
  },
  {
    slug: "tiktok-shop-store-setup-foundation",
    title: "TikTok Shop Setup: Building a Store Foundation Before Growth",
    excerpt:
      "TikTok Shop gives sellers a powerful way to connect product visibility with social buying behavior and content-driven discovery.",
    category: "TikTok Shop",
    Icon: Tv,
    image: tiktokSocialImg,
    imageAlt: "TikTok Shop social commerce product discovery",
    intro:
      "TikTok Shop is content-first commerce. A strong launch means having your product, your store, and your operational basics ready before content drives traffic to you.",
    sections: [
      {
        heading: "Product Selection",
        body:
          "Choose products that fit a content-driven audience: visual, demonstrable, and shareable. Not every product performs in this format.",
      },
      {
        heading: "Shop Presentation",
        body:
          "Clear product images, accurate descriptions, and consistent branding make first-time visitors trust your store enough to buy.",
      },
      {
        heading: "Content-Commerce Mindset",
        body:
          "TikTok Shop rewards sellers who think like creators. Plan how product content, demos, and partnerships will support your store, not just your ads.",
      },
      {
        heading: "Order Handling Preparation",
        body:
          "Sudden visibility can mean sudden orders. Have packaging, shipping, and customer response ready before pushing for reach.",
      },
      {
        heading: "Store Management Basics",
        body:
          "Inventory updates, policy compliance, and review monitoring keep the store healthy long after launch day.",
      },
    ],
  },
  {
    slug: "ebay-store-management-system",
    title: "eBay Store Management: Why Clean Listings and Reporting Matter",
    excerpt:
      "Consistent listings, clear product information, pricing strategy, and order support can help create a stronger eBay selling experience.",
    category: "eBay",
    Icon: ShoppingBag,
    image: ebayManagementImg,
    imageAlt: "eBay store management product listing dashboard",
    intro:
      "eBay rewards consistency. A clean, well-managed store is easier for buyers to trust and easier for you to operate as you grow.",
    sections: [
      {
        heading: "Listing Consistency",
        body:
          "Use a consistent format across titles, descriptions, and item specifics. Buyers and eBay's search both reward predictability.",
      },
      {
        heading: "Product Titles and Images",
        body:
          "Clear titles and accurate images reduce returns and questions. Avoid keyword stuffing — write for the actual buyer first.",
      },
      {
        heading: "Pricing Review",
        body:
          "Review competitor pricing, shipping costs, and promotions regularly. Small pricing decisions add up across a catalog.",
      },
      {
        heading: "Seller Performance Basics",
        body:
          "Response time, shipping speed, and dispute handling directly influence visibility. Track these as carefully as you track sales.",
      },
      {
        heading: "Organized Reporting",
        body:
          "A simple weekly report — sales, returns, top movers, low movers — turns activity into decisions.",
      },
    ],
  },
  {
    slug: "store-management-after-launch",
    title: "Why Store Management Matters After Marketplace Launch",
    excerpt:
      "Store management is more than uploading products. It includes reporting, optimization, updates, coordination, and consistent operational support.",
    category: "Store Management",
    Icon: Settings,
    image: storeManagementImg,
    imageAlt: "Professional ecommerce store management dashboard",
    intro:
      "Launching a store is the first step, not the finish line. The real work — and the real growth — comes from the daily and weekly operations that follow.",
    sections: [
      {
        heading: "Launch Is Only the First Step",
        body:
          "A live store needs care. Without consistent management, listings go stale, inventory drifts, and performance metrics quietly decline.",
      },
      {
        heading: "Daily and Weekly Operational Tasks",
        body:
          "Order checks, message responses, listing updates, and inventory reviews build a reliable operating rhythm.",
      },
      {
        heading: "Listing Updates",
        body:
          "Keep content, pricing, and stock current. Outdated listings cost sales and damage performance scores.",
      },
      {
        heading: "Inventory and Fulfillment Checks",
        body:
          "Avoid overselling and stockouts with simple, repeatable checks tied to your supplier and shipping schedule.",
      },
      {
        heading: "Customer Communication",
        body:
          "Fast, professional responses protect your seller standing and turn one-time buyers into returning customers.",
      },
      {
        heading: "Reporting and Improvement",
        body:
          "Track what's working and what's not. Use reports to make small, steady improvements instead of relying on guesswork.",
      },
    ],
  },
  {
    slug: "product-research-listing-structure",
    title: "Product Research and Listing Structure for Marketplace Sellers",
    excerpt:
      "Research before listing, clean category selection, pricing awareness, and listing clarity help sellers avoid messy store growth.",
    category: "Seller Growth",
    Icon: TrendingUp,
    image: pricingPlansImg,
    imageAlt: "Marketplace product research and listing structure",
    intro:
      "Strong sellers do the work before the upload. Product research and listing structure decide whether a product gets seen, trusted, and bought.",
    sections: [
      {
        heading: "Research Before Listing",
        body:
          "Validate demand, competition, and category fit before you commit time and inventory. A few hours of research saves weeks of cleanup.",
      },
      {
        heading: "Category Selection",
        body:
          "Pick the most accurate category, not the most popular one. Wrong-category listings get suppressed or under-shown.",
      },
      {
        heading: "Pricing Awareness",
        body:
          "Know the price range buyers expect and where your offer sits inside it. Pricing should reflect your cost, your strategy, and the market.",
      },
      {
        heading: "Listing Clarity",
        body:
          "Clear titles, organized bullets, and accurate attributes reduce questions, returns, and disputes.",
      },
      {
        heading: "Avoiding Messy Store Growth",
        body:
          "Adding products without structure creates an unmanageable store. Build a template, document your process, and grow on top of it.",
      },
    ],
  },
  {
    slug: "marketplace-account-control",
    title: "Why Sellers Should Keep Control of Their Marketplace Accounts",
    excerpt:
      "Ray Ecommerce supports sellers while the seller remains the account owner. This creates a clear, professional, and transparent working relationship.",
    category: "Store Management",
    Icon: Settings,
    image: accountControlImg,
    imageAlt: "Secure marketplace account ownership and seller control",
    intro:
      "Your marketplace account is your business asset. A healthy service relationship strengthens that ownership instead of replacing it.",
    sections: [
      {
        heading: "You Stay the Account Owner",
        body:
          "Ray Ecommerce works as a professional management partner. The account, the bank details, and the business stay yours.",
      },
      {
        heading: "Transparent Access",
        body:
          "Clear, scoped access — only what is needed to do the work — keeps the relationship safe and easy to manage over time.",
      },
      {
        heading: "Documented Operations",
        body:
          "Every change should be traceable. Documentation protects both the seller and the service partner.",
      },
      {
        heading: "Easy Handover",
        body:
          "Because you own the account, you can change support, scale up, or bring work in-house without losing your store.",
      },
    ],
  },
  {
    slug: "marketplace-ad-management-visibility",
    title: "How Marketplace Ad Management Supports Better Product Visibility",
    excerpt:
      "Ad management can help sellers understand campaign structure, budget control, product visibility, and performance reporting without relying on guesswork.",
    category: "Ad Management",
    Icon: Megaphone,
    image: pricingPlansImg,
    imageAlt: "Marketplace ad management campaign dashboard",
    intro:
      "Marketplace ads are not a magic button. Sellers who treat ads as a structured operation — with clear campaign goals, budgets, and reporting — make better decisions than sellers who boost listings on instinct.",
    sections: [
      {
        heading: "Campaign Structure First",
        body:
          "Group products by category, margin, and goal before launching campaigns. A clean structure makes performance readable and lets you scale what works without scaling what doesn't.",
      },
      {
        heading: "Budget Control",
        body:
          "Daily budgets, bid ceilings, and pacing decisions protect spend. Without controls, a single underperforming campaign can drain a month of ad budget overnight.",
      },
      {
        heading: "Product Visibility",
        body:
          "Ads are one input to visibility — listing quality, pricing, and reviews also decide whether a click becomes a sale. Treat ads as an amplifier of a healthy listing, not a fix for a weak one.",
      },
      {
        heading: "Performance Reporting",
        body:
          "Track impressions, clicks, conversion rate, ACoS/TACoS, and net contribution per product. Reporting closes the loop between spend and outcome.",
      },
      {
        heading: "Where Ray Ecommerce Helps",
        body:
          "Ad management is available where applicable as part of marketplace operations support. Outcomes depend on product, marketplace, demand, and competition — Ray Ecommerce does not guarantee ad results.",
      },
    ],
  },
  {
    slug: "reporting-before-scaling-marketplace-ads",
    title: "Why Reporting Matters Before Scaling Marketplace Ads",
    excerpt:
      "Before increasing ad spend, sellers need clear reporting around product performance, costs, marketplace fees, and net profit visibility.",
    category: "Ad Management",
    Icon: BarChart3,
    image: storeManagementImg,
    imageAlt: "Marketplace ad reporting and net profit analytics",
    intro:
      "Scaling ads without reporting is how budgets disappear. A simple reporting rhythm gives sellers the visibility to decide what to push, what to pause, and what to fix before adding more spend.",
    sections: [
      {
        heading: "Know Your Cost Stack",
        body:
          "Product cost, shipping, marketplace fees, software, and ad spend stack on top of each other. Reporting that ignores any of these can make a losing product look profitable.",
      },
      {
        heading: "Read Performance Per Product",
        body:
          "Aggregate numbers hide weak SKUs. Performance-per-product reporting is what lets sellers find the few products that actually deserve more budget.",
      },
      {
        heading: "Net Profit Visibility",
        body:
          "Net profit — revenue minus marketplace fees, product and supplier costs, ad spend, shipping, and other operating expenses — is the number that matters before scaling spend.",
      },
      {
        heading: "Test, Then Scale",
        body:
          "Use reporting to validate that a small test is actually profitable on a net basis. Scale spend on signals, not feelings.",
      },
      {
        heading: "Compliance & Honesty",
        body:
          "Ray Ecommerce does not guarantee ad performance, revenue, or profit. Marketplace outcomes depend on product selection, supplier pricing, marketplace rules, demand, and competition.",
      },
    ],
  },
];

export const STORIES: Story[] = [
  {
    slug: "walmart-seller-organization-journey",
    title: "From Confused Setup to a More Organized Walmart Marketplace Operation",
    excerpt:
      "An anonymized seller-style journey showing how structure, documentation, listing cleanup, and reporting can create a clearer marketplace operation.",
    platform: "Walmart Marketplace",
    Icon: Store,
    image: successWalmartImg,
    imageAlt: "Walmart Marketplace seller organization journey",
    intro:
      "A marketplace seller wanted to operate on Walmart Marketplace but struggled to understand what was needed to get organized and operational.",
    challenge:
      "Scattered business documents, unclear product categories, inconsistent listing data, and no defined operational rhythm made the path forward feel overwhelming.",
    organized: [
      "Readiness checklist for business and account information",
      "Store setup structure aligned to Walmart's expectations",
      "Cleaner product listing flow with documented templates",
      "A simple weekly reporting and review process",
    ],
    improvements: [
      "Centralized documentation replaced ad-hoc files",
      "Listings followed a consistent format across the catalog",
      "Operational tasks moved from memory to a written cadence",
    ],
    outcome:
      "The seller moved from confusion to a clearer, more professional operating system — better prepared to manage day-to-day Walmart Marketplace activity.",
  },
  {
    slug: "tiktok-shop-launch-preparation",
    title: "A TikTok Shop Seller Preparing for a Cleaner Launch",
    excerpt:
      "A small product-based business wanted to launch on TikTok Shop but had scattered product details and no clear store plan.",
    platform: "TikTok Shop",
    Icon: Tv,
    image: successTiktokImg,
    imageAlt: "TikTok Shop seller preparing for a cleaner launch",
    intro:
      "A small product-based business wanted to launch on TikTok Shop but had scattered product details and no clear store plan.",
    challenge:
      "Inconsistent product information, no defined fulfillment plan, and no operational rhythm for handling orders once visibility began.",
    organized: [
      "Product presentation cleanup across titles, images, and descriptions",
      "Shop setup steps mapped from registration through go-live",
      "Fulfillment preparation including packaging and shipping flow",
      "A simple management rhythm for orders, messages, and reviews",
    ],
    improvements: [
      "A documented launch plan replaced guesswork",
      "Product data became consistent and ready to scale",
      "The team knew what to do on day one after launch",
    ],
    outcome:
      "The seller reached launch with a more prepared foundation — ready to handle real orders without scrambling.",
  },
  {
    slug: "ebay-store-cleanup-story",
    title: "Cleaning Up an eBay Store for Better Management",
    excerpt:
      "A growing seller team had inconsistent product listings and unclear reporting on eBay.",
    platform: "eBay",
    Icon: ShoppingBag,
    image: successEbayImg,
    imageAlt: "eBay store cleanup and management improvement",
    intro:
      "A growing seller team had inconsistent product listings and unclear reporting on eBay, which made it hard to manage the store as it scaled.",
    challenge:
      "Mixed listing formats, outdated pricing, and no clear way to see what was selling and what wasn't.",
    organized: [
      "Listing updates with a consistent title and attribute structure",
      "Product categories reviewed and aligned",
      "Pricing presentation reviewed across the catalog",
      "A cleaner weekly store management workflow",
    ],
    improvements: [
      "Listings became easier to compare and maintain",
      "Reporting gave the team a clear weekly picture",
      "Store decisions moved from instinct to data",
    ],
    outcome:
      "The store became easier to manage and easier to track, giving the team a cleaner foundation for ongoing growth.",
  },
];

export const DISCLAIMER =
  "Results vary based on account readiness, product category, marketplace rules, and seller execution. Ray Ecommerce provides professional setup, management, and support services — outcomes depend on each seller's business.";

export function getArticle(slug: string) {
  return ARTICLES.find((a) => a.slug === slug);
}

export function getStory(slug: string) {
  return STORIES.find((s) => s.slug === slug);
}
