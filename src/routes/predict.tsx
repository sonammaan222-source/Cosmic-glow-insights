import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { z } from "zod";
import { ArrowLeft, ArrowRight, Sparkles, Check } from "lucide-react";
import { Starfield } from "@/components/Starfield";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Toaster, toast } from "sonner";
import { generatePrediction, type PredictionInput } from "@/lib/cosmic";

export const Route = createFileRoute("/predict")({
  head: () => ({
    meta: [
      { title: "Get Your Reading — Cosmic Insight" },
      { name: "description", content: "Enter your birth details to generate a personalized astrology and numerology reading." },
      { property: "og:title", content: "Get Your Reading — Cosmic Insight" },
      { property: "og:url", content: "/predict" },
    ],
    links: [{ rel: "canonical", href: "/predict" }],
  }),
  component: PredictPage,
});

const schema = z.object({
  fullName: z.string().trim().min(2, "Tell us your full name").max(80),
  gender: z.string().max(40).optional(),
  city: z.string().max(80).optional(),
  country: z.string().max(80).optional(),
  dob: z.string().min(1, "Date of birth is required"),
  time: z.string().optional(),
  unknownTime: z.boolean().optional(),
  birthCity: z.string().trim().min(1, "Birth city is required").max(80),
  birthCountry: z.string().max(80).optional(),
  preferredName: z.string().max(80).optional(),
  lifeGoals: z.string().max(300).optional(),
  relationshipStatus: z.string().max(40).optional(),
  readingType: z.enum(["astrology", "numerology", "combined"]),
  categories: z.array(z.string()).default([]),
});

const STEPS = ["Personal", "Birth", "Numerology", "Preferences"] as const;

const CATEGORIES = [
  "Personality Overview", "Strengths", "Growth Areas", "Career Tendencies",
  "Learning Style", "Relationships", "Life Path", "Lucky Numbers",
  "Lucky Colors", "Daily Energy", "Zodiac Summary", "General Guidance",
];

function PredictPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<PredictionInput & { categories: string[] }>({
    fullName: "", gender: "", city: "", country: "",
    dob: "", time: "", unknownTime: false, birthCity: "", birthCountry: "",
    preferredName: "", lifeGoals: "", relationshipStatus: "",
    readingType: "combined", categories: CATEGORIES.slice(0, 8),
  });
  const [loading, setLoading] = useState(false);

  const tz = useMemo(() => {
    try { return Intl.DateTimeFormat().resolvedOptions().timeZone; } catch { return "UTC"; }
  }, []);

  const update = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const next = () => {
    // per-step validation
    if (step === 0 && !form.fullName.trim()) return toast.error("Please add your full name.");
    if (step === 1) {
      if (!form.dob) return toast.error("Please pick your date of birth.");
      if (!form.unknownTime && !form.time) return toast.error("Add a time of birth or mark it unknown.");
      if (!form.birthCity?.trim()) return toast.error("Please add your birth city.");
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const prev = () => setStep((s) => Math.max(0, s - 1));

  const submit = () => {
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please review the form.");
      return;
    }
    setLoading(true);
    const payload: PredictionInput = parsed.data;
    setTimeout(() => {
      const result = generatePrediction(payload);
      try {
        sessionStorage.setItem(
          "cosmic:last",
          JSON.stringify({ input: payload, result, categories: form.categories }),
        );
      } catch {}
      navigate({ to: "/results" });
    }, 1200);
  };

  return (
    <div className="relative min-h-screen">
      <Starfield />
      <Navbar />
      <main className="px-4 pt-32 pb-20 md:pt-36">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 text-center">
            <p className="text-xs tracking-[0.3em] text-gold">YOUR COSMIC FORM</p>
            <h1 className="mt-2 font-display text-3xl md:text-4xl">Tell the stars who you are</h1>
          </div>

          {/* progress */}
          <div className="mb-8 flex items-center justify-between gap-2">
            {STEPS.map((label, i) => (
              <div key={label} className="flex-1">
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs ${
                      i <= step
                        ? "border-[oklch(0.82_0.14_85/0.6)] bg-[image:var(--gradient-gold)] text-primary-foreground"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
                  </div>
                  <span className={`hidden text-xs tracking-wider sm:inline ${i <= step ? "text-gold" : "text-muted-foreground"}`}>
                    {label.toUpperCase()}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="mt-3 h-px bg-gradient-to-r from-[oklch(0.82_0.14_85/0.4)] to-transparent" />
                )}
              </div>
            ))}
          </div>

          <div className="glass-strong rounded-3xl p-6 md:p-10">
            {step === 0 && (
              <div className="grid gap-5 animate-reveal">
                <Field label="Full Name" required>
                  <Input value={form.fullName} onChange={(e) => update("fullName", e.target.value)} placeholder="Ada Lovelace" className="bg-transparent" maxLength={80} />
                </Field>
                <div className="grid gap-5 md:grid-cols-2">
                  <Field label="Gender (optional)">
                    <Input value={form.gender} onChange={(e) => update("gender", e.target.value)} placeholder="Woman / Man / Non-binary / —" className="bg-transparent" maxLength={40} />
                  </Field>
                  <Field label="Current City">
                    <Input value={form.city} onChange={(e) => update("city", e.target.value)} placeholder="London" className="bg-transparent" maxLength={80} />
                  </Field>
                </div>
                <Field label="Country">
                  <Input value={form.country} onChange={(e) => update("country", e.target.value)} placeholder="United Kingdom" className="bg-transparent" maxLength={80} />
                </Field>
              </div>
            )}

            {step === 1 && (
              <div className="grid gap-5 animate-reveal">
                <div className="grid gap-5 md:grid-cols-2">
                  <Field label="Date of Birth" required>
                    <Input type="date" value={form.dob} onChange={(e) => update("dob", e.target.value)} className="bg-transparent" />
                  </Field>
                  <Field label="Time of Birth" required={!form.unknownTime}>
                    <Input
                      type="time"
                      value={form.time}
                      onChange={(e) => update("time", e.target.value)}
                      disabled={form.unknownTime}
                      className="bg-transparent disabled:opacity-40"
                    />
                  </Field>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-border bg-[oklch(0.22_0.07_285/0.4)] px-4 py-3">
                  <div>
                    <Label className="text-sm">I don't know my exact birth time</Label>
                    <p className="text-xs text-muted-foreground">We'll focus on Sun sign and numerology instead.</p>
                  </div>
                  <Switch checked={!!form.unknownTime} onCheckedChange={(v) => update("unknownTime", v)} />
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  <Field label="Birth City" required>
                    <Input value={form.birthCity} onChange={(e) => update("birthCity", e.target.value)} placeholder="Kyoto" className="bg-transparent" maxLength={80} />
                  </Field>
                  <Field label="Birth Country">
                    <Input value={form.birthCountry} onChange={(e) => update("birthCountry", e.target.value)} placeholder="Japan" className="bg-transparent" maxLength={80} />
                  </Field>
                </div>
                <p className="text-xs text-muted-foreground">Detected timezone: <span className="text-gold">{tz}</span></p>
              </div>
            )}

            {step === 2 && (
              <div className="grid gap-5 animate-reveal">
                <Field label="Preferred / Current Name">
                  <Input value={form.preferredName} onChange={(e) => update("preferredName", e.target.value)} placeholder="The name you use day-to-day" className="bg-transparent" maxLength={80} />
                </Field>
                <Field label="Life Goals (optional)">
                  <Textarea value={form.lifeGoals} onChange={(e) => update("lifeGoals", e.target.value)} placeholder="What are you reaching toward right now?" className="min-h-28 bg-transparent" maxLength={300} />
                </Field>
                <Field label="Relationship Status (optional)">
                  <Input value={form.relationshipStatus} onChange={(e) => update("relationshipStatus", e.target.value)} placeholder="Single / Partnered / It's complex" className="bg-transparent" maxLength={40} />
                </Field>
              </div>
            )}

            {step === 3 && (
              <div className="grid gap-6 animate-reveal">
                <div>
                  <Label className="mb-3 block text-sm">Reading type</Label>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {(["astrology", "numerology", "combined"] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => update("readingType", t)}
                        className={`rounded-xl border px-4 py-3 text-sm capitalize transition ${
                          form.readingType === t
                            ? "border-[oklch(0.82_0.14_85/0.7)] bg-[image:var(--gradient-aurora)] text-primary-foreground glow-violet"
                            : "border-border text-muted-foreground hover:text-gold"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="mb-3 block text-sm">Categories to include</Label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((c) => {
                      const active = form.categories.includes(c);
                      return (
                        <button
                          type="button"
                          key={c}
                          onClick={() =>
                            update("categories", active
                              ? form.categories.filter((x) => x !== c)
                              : [...form.categories, c])
                          }
                          className={`rounded-full border px-3 py-1.5 text-xs transition ${
                            active
                              ? "border-[oklch(0.82_0.14_85/0.6)] bg-[oklch(0.82_0.14_85/0.18)] text-gold"
                              : "border-border text-muted-foreground hover:text-gold"
                          }`}
                        >
                          {c}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-xl border border-[oklch(0.82_0.14_85/0.25)] bg-[oklch(0.22_0.07_285/0.4)] p-4 text-xs text-muted-foreground">
                  <strong className="text-gold">Disclaimer.</strong> This experience is for
                  entertainment and self-reflection purposes and should not be treated as
                  professional, financial, legal, or medical advice.
                </div>
              </div>
            )}

            <div className="mt-8 flex items-center justify-between">
              <button
                type="button"
                onClick={prev}
                disabled={step === 0}
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-muted-foreground transition hover:text-gold disabled:opacity-30"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              {step < STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={next}
                  className="inline-flex items-center gap-2 rounded-full bg-[image:var(--gradient-gold)] px-5 py-2.5 text-sm font-semibold tracking-wider text-primary-foreground shadow-[var(--shadow-glow-gold)] transition hover:scale-105"
                >
                  Continue <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={loading}
                  onClick={submit}
                  className="inline-flex items-center gap-2 rounded-full bg-[image:var(--gradient-gold)] px-6 py-2.5 text-sm font-semibold tracking-wider text-primary-foreground shadow-[var(--shadow-glow-gold)] transition hover:scale-105 disabled:opacity-70"
                >
                  {loading ? (
                    <><Sparkles className="h-4 w-4 animate-spin" /> CONSULTING THE STARS…</>
                  ) : (
                    <><Sparkles className="h-4 w-4" /> REVEAL MY READING</>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <Toaster theme="dark" position="top-center" />
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <Label className="mb-1.5 block text-xs tracking-wider text-muted-foreground">
        {label.toUpperCase()} {required && <span className="text-gold">*</span>}
      </Label>
      {children}
    </div>
  );
}
