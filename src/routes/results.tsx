import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Download, Share2, Sparkles, RotateCcw } from "lucide-react";
import { Starfield } from "@/components/Starfield";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { Toaster, toast } from "sonner";
import type { Prediction, PredictionInput } from "@/lib/cosmic";

export const Route = createFileRoute("/results")({
  head: () => ({
    meta: [
      { title: "Your Cosmic Reading — Cosmic Insight" },
      { name: "description", content: "Your personalized astrology and numerology reading." },
      { property: "og:title", content: "Your Cosmic Reading" },
      { property: "og:url", content: "/results" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/results" }],
  }),
  component: ResultsPage,
});

type Stored = { input: PredictionInput; result: Prediction; categories: string[] };

function ResultsPage() {
  const [data, setData] = useState<Stored | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("cosmic:last");
      if (raw) setData(JSON.parse(raw) as Stored);
    } catch {}
  }, []);

  if (!data) {
    return (
      <div className="relative min-h-screen">
        <Starfield />
        <Navbar />
        <main className="grid min-h-screen place-items-center px-6 pt-32">
          <div className="glass max-w-md rounded-2xl p-8 text-center">
            <Sparkles className="mx-auto h-8 w-8 text-gold" />
            <h1 className="mt-4 font-display text-2xl">No reading yet</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Generate your first reading to see your cosmic snapshot here.
            </p>
            <Link
              to="/predict"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[image:var(--gradient-gold)] px-5 py-2.5 text-sm font-semibold tracking-wider text-primary-foreground shadow-[var(--shadow-glow-gold)]"
            >
              Get my reading
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const { input, result, categories } = data;
  const wants = (k: string) => categories.length === 0 || categories.includes(k);

  const onShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: "My Cosmic Reading", text: `I'm a ${result.zodiac.name} with a Life Path ${result.lifePath}.`, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard.");
      }
    } catch {}
  };

  const onSave = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cosmic-reading-${input.fullName.replace(/\s+/g, "-").toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Reading saved.");
  };

  return (
    <div className="relative min-h-screen">
      <Starfield />
      <Navbar />
      <main className="px-4 pt-32 pb-16 md:pt-36">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <div className="text-center animate-reveal">
            <p className="text-xs tracking-[0.3em] text-gold">YOUR COSMIC SNAPSHOT</p>
            <h1 className="mt-3 font-display text-4xl md:text-5xl">
              {input.preferredName?.trim() || input.fullName.split(" ")[0]},<br />
              the cosmos sees you as a{" "}
              <span className="text-gold">{result.zodiac.name}</span>.
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Born {new Date(input.dob).toLocaleDateString(undefined, { dateStyle: "long" })}
              {!input.unknownTime && input.time ? ` at ${input.time}` : ""} · {input.birthCity}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button onClick={onSave} className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs tracking-wider text-gold hover:glow-gold">
                <Download className="h-3.5 w-3.5" /> SAVE READING
              </button>
              <button onClick={onShare} className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs tracking-wider text-gold hover:glow-gold">
                <Share2 className="h-3.5 w-3.5" /> SHARE
              </button>
              <Link to="/predict" className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs tracking-wider text-gold hover:glow-gold">
                <RotateCcw className="h-3.5 w-3.5" /> NEW READING
              </Link>
            </div>
          </div>

          {/* Top cards */}
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            <StatCard label="Zodiac" value={`${result.zodiac.symbol} ${result.zodiac.name}`} sub={`${result.zodiac.element} · ${result.zodiac.modality}`} />
            <StatCard label="Life Path" value={`${result.lifePath}`} sub={result.meaningLife.title} />
            <StatCard label="Destiny" value={`${result.destiny}`} sub={result.meaningDestiny.title} />
          </div>

          {/* Cosmic Snapshot */}
          {wants("Zodiac Summary") && (
            <Section title="Zodiac Overview" delay={0}>
              <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
                <div className="glass flex flex-col items-center justify-center rounded-2xl p-6 text-center">
                  <div className="text-6xl text-gold">{result.zodiac.symbol}</div>
                  <div className="mt-2 font-display text-2xl">{result.zodiac.name}</div>
                  <div className="mt-1 text-xs tracking-wider text-muted-foreground">
                    {result.zodiac.element.toUpperCase()} · RULED BY {result.zodiac.rulingPlanet.toUpperCase()}
                  </div>
                </div>
                <div className="space-y-4 text-sm text-muted-foreground">
                  <p className="text-base text-foreground">{result.zodiac.summary}</p>
                  {wants("Strengths") && (
                    <p><span className="text-gold">Strengths · </span>{result.zodiac.traits.join(" · ")}</p>
                  )}
                  {wants("Daily Energy") && (
                    <p><span className="text-gold">Today's energy · </span>{result.daily}</p>
                  )}
                </div>
              </div>
            </Section>
          )}

          {/* Numerology */}
          <Section title="Numerology Summary" delay={80}>
            <div className="grid gap-5 md:grid-cols-2">
              <NumberCard num={result.lifePath} meaning={result.meaningLife} label="Life Path" />
              <NumberCard num={result.destiny} meaning={result.meaningDestiny} label="Destiny" />
            </div>
          </Section>

          {/* Career */}
          {wants("Career Tendencies") && (
            <Section title="Career Tendencies" delay={120}>
              <div className="glass rounded-2xl p-6 text-sm text-muted-foreground">
                <p className="text-base text-foreground">{result.career}</p>
                <p className="mt-3"><span className="text-gold">Roles to explore · </span>{result.meaningLife.career.join(" · ")}</p>
                {wants("Learning Style") && (
                  <p className="mt-2"><span className="text-gold">Learning style · </span>{result.meaningLife.learning}</p>
                )}
              </div>
            </Section>
          )}

          {/* Relationships */}
          {wants("Relationships") && (
            <Section title="Relationship Insights" delay={160}>
              <div className="glass rounded-2xl p-6 text-sm">
                <p className="text-base text-foreground">{result.relationships}</p>
              </div>
            </Section>
          )}

          {/* Life Path Indicators */}
          {wants("Life Path") && (
            <Section title="Life Path Indicators" delay={200}>
              <Accordion type="single" collapsible className="glass rounded-2xl p-2">
                {result.meaningLife.strengths.length > 0 && (
                  <AccordionItem value="s" className="border-[oklch(0.82_0.14_85/0.15)] px-4">
                    <AccordionTrigger className="text-base hover:text-gold">Strengths</AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">{result.meaningLife.strengths.join(" · ")}</AccordionContent>
                  </AccordionItem>
                )}
                {wants("Growth Areas") && (
                  <AccordionItem value="g" className="border-[oklch(0.82_0.14_85/0.15)] px-4">
                    <AccordionTrigger className="text-base hover:text-gold">Growth Areas</AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">{result.meaningLife.growth.join(" · ")}</AccordionContent>
                  </AccordionItem>
                )}
                <AccordionItem value="e" className="border-[oklch(0.82_0.14_85/0.15)] px-4">
                  <AccordionTrigger className="text-base hover:text-gold">Essence</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">{result.meaningLife.essence}</AccordionContent>
                </AccordionItem>
              </Accordion>
            </Section>
          )}

          {/* Lucky */}
          <Section title="Lucky Numbers & Colors" delay={240}>
            <div className="grid gap-5 md:grid-cols-2">
              {wants("Lucky Numbers") && (
                <div className="glass rounded-2xl p-6">
                  <p className="text-xs tracking-widest text-gold">NUMBERS</p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {result.luckyNumbers.map((n) => (
                      <div key={n} className="flex h-12 w-12 items-center justify-center rounded-full bg-[image:var(--gradient-aurora)] text-base font-semibold text-primary-foreground glow-violet">
                        {n}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {wants("Lucky Colors") && (
                <div className="glass rounded-2xl p-6">
                  <p className="text-xs tracking-widest text-gold">COLORS</p>
                  <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                    {result.luckyColors.map((c) => (
                      <div key={c} className="flex items-center gap-3">
                        <span className="h-4 w-4 rounded-full border border-border" style={{ background: swatch(c) }} />
                        {c}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Section>

          {/* Guidance */}
          {wants("General Guidance") && (
            <Section title="Personalized Guidance" delay={280}>
              <div className="glass-strong rounded-2xl p-8 text-center">
                <Sparkles className="mx-auto h-6 w-6 text-gold" />
                <p className="mt-4 font-display text-xl text-foreground md:text-2xl">
                  "{result.guidance}"
                </p>
              </div>
            </Section>
          )}

          <p className="mt-12 text-center text-xs text-muted-foreground">
            For entertainment and self-reflection only — not professional, medical, legal, or financial advice.
          </p>
        </div>
      </main>
      <Footer />
      <Toaster theme="dark" position="top-center" />
    </div>
  );
}

function Section({ title, children, delay = 0 }: { title: string; children: React.ReactNode; delay?: number }) {
  return (
    <section className="mt-10 animate-reveal" style={{ animationDelay: `${delay}ms` }}>
      <h2 className="mb-4 font-display text-2xl text-gold">{title}</h2>
      {children}
    </section>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="glass rounded-2xl p-6 text-center">
      <p className="text-xs tracking-widest text-gold">{label.toUpperCase()}</p>
      <p className="mt-2 font-display text-3xl">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
    </div>
  );
}

function NumberCard({
  num, label, meaning,
}: {
  num: number; label: string;
  meaning: { title: string; essence: string; strengths: string[]; growth: string[] };
}) {
  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[image:var(--gradient-gold)] font-display text-2xl text-primary-foreground glow-gold">
          {num}
        </div>
        <div>
          <p className="text-xs tracking-widest text-gold">{label.toUpperCase()}</p>
          <p className="font-display text-lg">{meaning.title}</p>
        </div>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">{meaning.essence}</p>
    </div>
  );
}

function swatch(name: string): string {
  const map: Record<string, string> = {
    "Crimson": "#dc2626", "Burnt orange": "#c2410c", "Sun gold": "#d4af37",
    "Forest green": "#166534", "Terracotta": "#b45309", "Bronze": "#92400e",
    "Sky blue": "#38bdf8", "Silver": "#cbd5e1", "Soft lavender": "#c4b5fd",
    "Deep indigo": "#3730a3", "Sea green": "#14b8a6", "Pearl white": "#f5f5f4",
  };
  return map[name] ?? "#888";
}
