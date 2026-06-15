import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div className="mx-auto mt-4 max-w-6xl px-4">
        <nav className="glass flex items-center justify-between rounded-full px-5 py-3">
          <Link to="/" className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-gold" />
            <span className="font-display text-base tracking-widest text-gold">
              COSMIC&nbsp;INSIGHT
            </span>
          </Link>
          <div className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            <a href="/#about" className="transition hover:text-gold">About</a>
            <a href="/#faq" className="transition hover:text-gold">FAQ</a>
            <a href="/#contact" className="transition hover:text-gold">Contact</a>
          </div>
          <Link
            to="/predict"
            className="rounded-full bg-[image:var(--gradient-gold)] px-4 py-2 text-xs font-semibold tracking-wider text-primary-foreground shadow-[var(--shadow-glow-gold)] transition hover:scale-105"
          >
            BEGIN READING
          </Link>
        </nav>
      </div>
    </header>
  );
}
