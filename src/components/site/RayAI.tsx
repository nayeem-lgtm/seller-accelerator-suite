import { useEffect, useRef, useState } from "react";
import { Bot, Send, X, MessageCircle, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useServerFn } from "@tanstack/react-start";
import { Link } from "@tanstack/react-router";
import { askRayAi } from "@/lib/ray-ai.functions";
import { toast } from "sonner";

type Msg = { role: "user" | "assistant"; content: string };

const GREETING: Msg = {
  role: "assistant",
  content:
    "Hi, I'm Ray AI — your premium marketplace growth assistant from Ray Ecommerce. I help serious sellers launch and grow on Walmart, TikTok Shop, and eBay. What are you looking to do today?",
};

const SUGGESTED = [
  "Which marketplace is best for me?",
  "What documents do I need?",
  "How does onboarding work?",
  "What's included in the Walmart package?",
  "Can I schedule a strategy call?",
];

export function RayAI() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const ask = useServerFn(askRayAi);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, typing, open]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || typing) return;
    const next = [...msgs, { role: "user" as const, content: trimmed }];
    setMsgs(next);
    setInput("");
    setTyping(true);
    try {
      const res = await ask({ data: { messages: next.map(({ role, content }) => ({ role, content })) } });
      setMsgs((m) => [...m, { role: "assistant", content: res.text }]);
    } catch (e) {
      console.error(e);
      toast.error("Ray AI is unavailable right now. Please try again.");
      setMsgs((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "I'm having trouble connecting right now. You can create your seller account or schedule strategy call and a specialist will reach out.",
        },
      ]);
    } finally {
      setTyping(false);
    }
  };

  const reset = () => setMsgs([GREETING]);

  return (
    <>
      {/* Floating launcher */}
      <button
        aria-label={open ? "Close Ray AI" : "Open Ray AI"}
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-50 h-14 w-14 rounded-full brand-gradient text-white shadow-xl btn-glow grid place-items-center transition-transform hover:scale-105"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {/* Chat panel */}
      <div
        className={`fixed bottom-24 right-5 z-50 w-[min(92vw,380px)] origin-bottom-right transition-all duration-200 ${
          open ? "scale-100 opacity-100 pointer-events-auto" : "scale-95 opacity-0 pointer-events-none"
        }`}
      >
        <div className="rounded-3xl border border-border bg-white shadow-2xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 brand-gradient text-white">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white/15 grid place-items-center backdrop-blur ring-2 ring-white/20">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-bold leading-tight">Ray AI</div>
                <div className="text-[11px] flex items-center gap-1.5 opacity-90">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75 animate-ping" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-300" />
                  </span>
                  Online · Ray Ecommerce
                </div>
              </div>
            </div>
            <button
              onClick={reset}
              className="text-[11px] inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/15 hover:bg-white/25 transition"
              aria-label="Reset conversation"
            >
              <RotateCcw className="h-3 w-3" /> Reset
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="h-[420px] max-h-[60vh] overflow-y-auto bg-accent/30 p-3 space-y-2">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
                    m.role === "user"
                      ? "brand-gradient text-white rounded-br-md"
                      : "bg-white border border-border text-foreground rounded-bl-md shadow-sm"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1 px-3.5 py-2.5 bg-white border border-border w-fit rounded-2xl rounded-bl-md shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-primary/70 animate-bounce" />
                  <span className="h-2 w-2 rounded-full bg-primary/70 animate-bounce" style={{ animationDelay: "0.15s" }} />
                  <span className="h-2 w-2 rounded-full bg-primary/70 animate-bounce" style={{ animationDelay: "0.3s" }} />
                </div>
              </div>
            )}
          </div>

          {/* Suggested */}
          {msgs.length <= 1 && (
            <div className="flex flex-wrap gap-1.5 px-3 pt-2 bg-white">
              {SUGGESTED.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="text-[11px] px-2.5 py-1 rounded-full bg-accent text-foreground hover:bg-primary hover:text-white transition"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Composer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 p-3 bg-white border-t border-border"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Ray AI…"
              disabled={typing}
              className="bg-accent/40 border-border focus-visible:ring-primary"
            />
            <Button
              type="submit"
              size="icon"
              disabled={typing || !input.trim()}
              className="brand-gradient text-white rounded-full shrink-0"
              aria-label="Send"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>

          {/* Footer CTAs */}
          <div className="grid grid-cols-2 gap-1.5 px-3 py-2 bg-white border-t border-border">
            <Link
              to="/contact"
              className="text-[10.5px] font-semibold text-center px-2 py-1.5 rounded-full brand-gradient text-white hover:opacity-90 transition leading-tight"
            >
              Strategy Call
            </Link>
            <Link
              to="/seller-onboarding"
              className="text-[10.5px] font-semibold text-center px-2 py-1.5 rounded-full border border-border text-foreground hover:border-primary hover:text-primary transition leading-tight inline-flex items-center justify-center gap-1"
            >
              <Sparkles className="h-3 w-3" /> Onboard
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
