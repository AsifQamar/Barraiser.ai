import Link from "next/link";
import { ArrowRight, CheckCircle, Star, Terminal } from "lucide-react";
import { Wordmark } from "@/components/barraiser/ui";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="relative min-h-dvh flex flex-col bg-background text-foreground overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-full grid-lines [mask-image:linear-gradient(to_bottom,black_10%,transparent_90%)] opacity-30" />
      
      {/* Navbar */}
      <header className="relative z-10 flex items-center justify-between px-5 py-4 sm:px-8 border-b border-border/50 backdrop-blur-md sticky top-0 bg-background/80">
        <Wordmark />
        <Link href="/setup">
          <Button variant="outline" size="sm" className="border-primary/50 text-primary hover:bg-primary/10">
            Sign In
          </Button>
        </Link>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center">
        {/* Hero Section */}
        <section className="w-full max-w-5xl px-5 pt-20 pb-24 sm:px-8 sm:pt-32 flex flex-col items-center text-center">
          <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary-soft px-3 py-1 text-sm font-medium text-primary mb-8 animate-fade-in">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
            v2.0 is now live
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-foreground mb-6 max-w-4xl animate-slide-up">
            Master the <span className="text-primary">Amazon Bar Raiser</span> Interview.
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl animate-slide-up" style={{ animationDelay: '100ms' }}>
            AI-driven mock interviews calibrated to authentic FAANG standards. Face real technical challenges and rigorous Leadership Principle evaluations.
          </p>
          <Link href="/setup" className="animate-slide-up" style={{ animationDelay: '200ms' }}>
            <Button size="lg" className="h-12 px-8 text-base bg-primary text-primary-foreground hover:bg-primary/90 gap-2 font-semibold">
              Get Started
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        </section>

        {/* Features Section */}
        <section className="w-full border-t border-border/50 bg-surface/30">
          <div className="max-w-6xl mx-auto px-5 py-24 sm:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-semibold mb-4">Why choose Barraiser?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">Everything you need to confidently pass the toughest engineering interviews in the world.</p>
            </div>
            
            <div className="grid sm:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<Terminal className="size-6 text-primary" />}
                title="Calibrated Technicals"
                desc="Algorithmic assessments dynamically tuned to your target role, level, and job description."
              />
              <FeatureCard 
                icon={<Star className="size-6 text-primary" />}
                title="Leadership Principles"
                desc="Rigorous behavioral probes focusing on measurable impact using the STAR format."
              />
              <FeatureCard 
                icon={<CheckCircle className="size-6 text-primary" />}
                title="Actionable Dossier"
                desc="Receive a comprehensive evaluation scorecard highlighting exactly where you need to improve."
              />
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="w-full max-w-6xl mx-auto px-5 py-24 sm:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold mb-4">Loved by Top Engineers</h2>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-6">
            <ReviewCard 
              quote="The behavioral scenarios were exactly what I faced in my L5 loop. The feedback on my STAR method was a game-changer."
              author="Sarah J."
              role="Senior SDE @ Amazon"
            />
            <ReviewCard 
              quote="Incredibly accurate difficulty for the system design and coding rounds. Helped me land my dream job at PhonePe."
              author="Rahul M."
              role="Backend Engineer @ PhonePe"
            />
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="w-full border-t border-border/50 bg-primary-soft/50 py-24 text-center">
          <h2 className="text-3xl font-semibold mb-6">Ready to raise the bar?</h2>
          <Link href="/setup">
            <Button size="lg" className="h-12 px-8 text-base bg-primary text-primary-foreground hover:bg-primary/90">
              Start Mock Interview
            </Button>
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 text-center text-sm text-muted-foreground">
        <p>© 2026 Barraiser.ai. All rights reserved.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="p-6 rounded-2xl border border-border bg-surface hover:border-primary/30 transition-colors">
      <div className="size-12 rounded-xl bg-primary-soft flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}

function ReviewCard({ quote, author, role }: { quote: string; author: string; role: string }) {
  return (
    <div className="p-8 rounded-2xl border border-border bg-surface-2 relative">
      <Star className="absolute top-8 right-8 size-5 text-primary/20" />
      <p className="text-foreground text-lg mb-6 leading-relaxed">"{quote}"</p>
      <div>
        <p className="font-semibold text-primary">{author}</p>
        <p className="text-sm text-muted-foreground">{role}</p>
      </div>
    </div>
  );
}
