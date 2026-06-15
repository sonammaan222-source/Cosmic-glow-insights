import { Sparkles, Instagram, Twitter, Github, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative mt-32 border-t border-[oklch(0.82_0.14_85/0.15)]">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-gold" />
            <span className="font-display text-lg tracking-widest text-gold">COSMIC INSIGHT</span>
          </div>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            Personalized astrology and numerology reflections drawn from the moment you arrived
            on Earth. Crafted for curiosity, wonder, and self-discovery.
          </p>
          <div className="mt-4 flex gap-3 text-muted-foreground">
            <a href="#" aria-label="Instagram" className="transition hover:text-gold"><Instagram className="h-4 w-4" /></a>
            <a href="#" aria-label="Twitter" className="transition hover:text-gold"><Twitter className="h-4 w-4" /></a>
            <a href="#" aria-label="GitHub" className="transition hover:text-gold"><Github className="h-4 w-4" /></a>
            <a href="mailto:hello@cosmicinsight.app" aria-label="Email" className="transition hover:text-gold"><Mail className="h-4 w-4" /></a>
          </div>
        </div>
        <div>
          <h4 className="text-xs font-semibold tracking-widest text-gold">EXPLORE</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><a href="/#about" className="hover:text-gold">About</a></li>
            <li><a href="/predict" className="hover:text-gold">Get a Reading</a></li>
            <li><a href="/#faq" className="hover:text-gold">FAQ</a></li>
            <li><a href="/#contact" className="hover:text-gold">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-semibold tracking-widest text-gold">LEGAL</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><a href="#" className="hover:text-gold">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-gold">Terms</a></li>
            <li><a href="#" className="hover:text-gold">Disclaimer</a></li>
          </ul>
        </div>
      </div>
      <div className="cosmic-divider" />
      <div className="mx-auto max-w-6xl px-6 py-6 text-center text-xs text-muted-foreground">
        For entertainment and self-reflection only — not professional, medical, legal, or financial advice.
        <br />© {new Date().getFullYear()} Cosmic Insight. Made under the stars.
      </div>
    </footer>
  );
}
