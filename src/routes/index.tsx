import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Sparkles, Stars, Moon, Sun, Compass, Heart, Flame, Send, Check,
} from "lucide-react";
import { Starfield } from "@/components/Starfield";
import { ZodiacWheel } from "@/components/ZodiacWheel";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast, Toaster } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cosmic Insight — Astrology & Numerology Readings" },
      {
        name: "description",
        content:
          "Discover what the universe reveals about you. Free personalized astrology and numerology readings based on your birth details.",
      },
      { property: "og:title", content: "Cosmic Insight — Astrology & Numerology" },
      { property: "og:description", content: "Personalized cosmic readings from your birth details." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Starfield />
      <Navbar />
      <Hero />
      <Highlights />
      <About />
      <FAQ />
      <Contact />
      <Footer />
      <Toaster theme="dark" position="top-center" />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative px-6 pt-40 pb-24 md:pt-48">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
        <div className="animate-reveal">
          <div className="glass mb-6 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs tracking-widest text-gold">
            <Sparkles className="h-3 w-3" /> COSMIC READINGS · 2026
          </div>
          <h1 className="font-display text-4xl leading-tight md:text-6xl">
            Discover what the <span className="text-gold">universe</span> reveals about you.
          </h1>
          <p className="mt-5 max-w-lg text-base text-muted-foreground md:text-lg">
            Generate personalized astrology and numerology insights from the exact moment you
            arrived on Earth — your birth date, time, and place.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/predict"
              className="group inline-flex items-center gap-2 rounded-full bg-[image:var(--gradient-gold)] px-6 py-3 text-sm font-semibold tracking-wider text-primary-foreground shadow-[var(--shadow-glow-gold)] transition hover:scale-105"
            >
              <Stars className="h-4 w-4" /> GET MY PREDICTION
            </Link>
            <Link
              to="/predict"
              search={{ tab: "numerology" } as never}
              className="glass inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold tracking-wider text-gold transition hover:glow-violet"
            >
              <Compass className="h-4 w-4" /> EXPLORE NUMEROLOGY
            </Link>
          </div>
          <p className="mt-6 max-w-md text-xs text-muted-foreground/80">
            For entertainment and self-reflection only — not professional, medical, legal, or financial advice.
          </p>
        </div>
        <div className="relative mx-auto w-full max-w-md animate-float-slow">
          <ZodiacWheel />
        </div>
      </div>
    </section>
  );
}

const HIGHLIGHTS = [
  { icon: Sun,     title: "Zodiac Reading",       desc: "Sun-sign personality, element, modality, and ruling planet." },
  { icon: Moon,    title: "Numerology Insights",  desc: "Life Path and Destiny numbers calculated from your birth and name." },
  { icon: Heart,   title: "Relationships",        desc: "How you connect, what you crave, and where you grow with others." },
  { icon: Flame,   title: "Career Tendencies",    desc: "Work styles, environments, and roles that suit your cosmic blueprint." },
  { icon: Compass, title: "Life Path Guidance",   desc: "Themes and directions to consider as you navigate the year ahead." },
  { icon: Stars,   title: "Lucky Numbers & Colors", desc: "Symbolic numbers and palette aligned with your element and path." },
];

function Highlights() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="text-xs tracking-[0.3em] text-gold">WHAT YOU'LL RECEIVE</p>
          <h2 className="mt-3 font-display text-3xl md:text-4xl">A reading written in starlight</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {HIGHLIGHTS.map(({ icon: Icon, title, desc }, i) => (
            <div
              key={title}
              className="glass group rounded-2xl p-6 transition hover:-translate-y-1 hover:glow-gold"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[image:var(--gradient-aurora)] text-primary-foreground glow-violet">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg text-gold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="scroll-mt-24 px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <p className="text-center text-xs tracking-[0.3em] text-gold">ABOUT THE CRAFT</p>
        <h2 className="mt-3 text-center font-display text-3xl md:text-4xl">
          Where ancient symbols meet modern reflection
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { t: "What is Astrology?", d: "Astrology is a symbolic language linking the sky at the moment of your birth to themes in your personality and life — a mirror, not a forecast." },
            { t: "What is Numerology?", d: "Numerology is the symbolic study of numbers drawn from your birth date and name — patterns that hint at your strengths and growth edges." },
            { t: "How readings are made", d: "Your inputs feed simple deterministic calculations — zodiac, life-path number, destiny number — and curated reflection prompts shaped by your profile." },
          ].map((c) => (
            <div key={c.t} className="glass rounded-2xl p-6">
              <h3 className="font-display text-lg text-gold">{c.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{c.d}</p>
            </div>
          ))}
        </div>
        <div className="cosmic-divider mt-16" />
      </div>
    </section>
  );
}

const FAQS = [
  { q: "How accurate are the predictions?",
    a: "Readings are reflective tools, not forecasts. They surface symbolic themes connected to your birth profile — use them as prompts for self-inquiry, not certainties." },
  { q: "Why does birth time matter?",
    a: "Birth time refines your reading by anchoring the Moon and rising sign placements. Without it, we focus on your Sun sign and numerology, which remain meaningful." },
  { q: "Can I update my details later?",
    a: "Yes — just generate a new reading. Nothing is locked, and you can save or share results from the results page." },
  { q: "Is numerology scientific?",
    a: "No. Numerology is a symbolic tradition with no empirical basis. We present it as a contemplative framework, not as science." },
  { q: "Is my information stored?",
    a: "We don't persist your birth details to any server. Readings are generated in your browser and cached only in your device's local storage for the session." },
];

function FAQ() {
  return (
    <section id="faq" className="scroll-mt-24 px-6 py-20">
      <div className="mx-auto max-w-3xl">
        <p className="text-center text-xs tracking-[0.3em] text-gold">QUESTIONS</p>
        <h2 className="mt-3 text-center font-display text-3xl md:text-4xl">Frequently asked</h2>
        <Accordion type="single" collapsible className="glass mt-10 rounded-2xl p-2">
          {FAQS.map((f, i) => (
            <AccordionItem key={i} value={`f${i}`} className="border-[oklch(0.82_0.14_85/0.15)] px-4">
              <AccordionTrigger className="text-left text-base text-foreground hover:text-gold">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

function Contact() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  return (
    <section id="contact" className="scroll-mt-24 px-6 py-20">
      <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-2">
        <div>
          <p className="text-xs tracking-[0.3em] text-gold">CONTACT</p>
          <h2 className="mt-3 font-display text-3xl md:text-4xl">Send a signal across the stars</h2>
          <p className="mt-4 text-sm text-muted-foreground">
            Questions, feedback, or partnership ideas? We typically respond within 2–3 business days.
          </p>
          <div className="mt-6 space-y-2 text-sm text-muted-foreground">
            <p>✦ hello@cosmicinsight.app</p>
            <p>✦ Replies under the new moon, usually faster.</p>
          </div>
        </div>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const data = new FormData(form);
            const email = data.get("email") as string;
            const message = data.get("message") as string;
            if (!email || !message) {
              toast.error("Please add an email and a message.");
              return;
            }
            setSending(true);
            try {
              const payload = {
                name: data.get("name") || "",
                email,
                subject: data.get("subject") || "",
                message,
              };
              const res = await fetch(
                "https://sonammaan-23.app.n8n.cloud/webhook-test/c27b0f45-bbde-43c8-8daa-c6ba66e5b2c7",
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(payload),
                }
              );
              if (!res.ok) throw new Error(`Webhook returned ${res.status}`);
              setSent(true);
              toast.success("Message received — the stars will reply soon.");
              form.reset();
              setTimeout(() => setSent(false), 3000);
            } catch {
              toast.error("Failed to send message. Please try again later.");
            } finally {
              setSending(false);
            }
          }}
          className="glass space-y-3 rounded-2xl p-6"
        >
          <Input name="name" placeholder="Your name" className="bg-transparent" />
          <Input name="email" type="email" placeholder="you@orbit.com" className="bg-transparent" required />
          <Input name="subject" placeholder="Subject" className="bg-transparent" />
          <Textarea name="message" placeholder="Your message…" className="min-h-32 bg-transparent" required />
          <button
            type="submit"
            disabled={sending}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[image:var(--gradient-gold)] px-5 py-3 text-sm font-semibold tracking-wider text-primary-foreground shadow-[var(--shadow-glow-gold)] transition hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {sending ? (
              <>SENDING…</>
            ) : sent ? (
              <><Check className="h-4 w-4" /> SENT</>
            ) : (
              <><Send className="h-4 w-4" /> SEND MESSAGE</>
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
