import { Link } from "react-router-dom";
import { AmbassadorPreboardingForm } from "@/components/preboarding/AmbassadorPreboardingForm";
import { LogIn, UserPlus, Search, Rocket } from "lucide-react";

const PARTNER_LOGOS = [
  { name: "CoCo Bubble Tea", src: "/ambassador-program/partners/coco.png" },
  { name: "Gong Cha", src: "/ambassador-program/partners/gongcha.png" },
  { name: "Haidilao", src: "/ambassador-program/partners/haidilao.png" },
  { name: "Freshslice", src: "/ambassador-program/partners/freshslice.png" },
  { name: "Real Fruit", src: "/ambassador-program/partners/realfruit.png" },
  { name: "Ajisen Ramen", src: "/ambassador-program/partners/ajisen.png" },
  { name: "Dairy Queen", src: "/ambassador-program/partners/dq.png" },
  { name: "168 Sushi", src: "/ambassador-program/partners/168sushi.png" },
];

const PROCESS_STEPS = [
  {
    icon: UserPlus,
    title: "Apply & Get Approved",
    description: "Submit your application with your social media profiles and analytics. Our team reviews applications within 5-7 business days.",
  },
  {
    icon: Search,
    title: "Browse Opportunities",
    description: "Access ongoing content opportunities with 1,000+ restaurant partners. Find collaborations that match your style and audience.",
  },
  {
    icon: Rocket,
    title: "Create & Grow",
    description: "Build your portfolio with real restaurant collaborations. Grow your following and establish yourself in the creator space.",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="py-6 px-4 border-b border-border">
        <div className="container max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/ambassador-program/snappy-logo.png"
              alt="Snappy"
              className="w-10 h-10 rounded-xl"
            />
            <h1 className="text-xl font-bold">Snappy Ambassador Program</h1>
          </div>
          <Link
            to="/staff/login"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogIn className="w-4 h-4" />
            <span className="hidden sm:inline">Staff Portal</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 px-4 md:py-16">
          <div className="container max-w-5xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Join Our Creator Partnership Program
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              The Snappy Partnership Program connects creators of all sizes with over 1,000 restaurant clients looking for authentic, high-quality content. Whether you're just starting out or an established creator, Snappy provides real opportunities to create, collaborate, and grow.
            </p>
          </div>
        </section>

        {/* How It Works - 3 Step Process */}
        <section className="py-12 px-4 bg-muted/30">
          <div className="container max-w-5xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-center mb-10">
              How It Works
            </h3>
            <div className="grid gap-8 md:grid-cols-3">
              {PROCESS_STEPS.map((step, index) => (
                <div
                  key={index}
                  className="relative bg-background rounded-xl p-6 border border-border shadow-sm text-center animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center mx-auto mt-2 mb-4">
                    <step.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h4 className="text-lg font-bold mb-2">{step.title}</h4>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Partner Carousel */}
        <section className="py-12 px-4 overflow-hidden">
          <div className="container max-w-5xl mx-auto">
            <h3 className="text-xl md:text-2xl font-bold text-center mb-2">
              1,000+ Restaurant Partners
            </h3>
            <p className="text-muted-foreground text-center mb-8">
              Join creators working with brands like these
            </p>

            <div className="relative">
              <div className="flex animate-scroll">
                {[...PARTNER_LOGOS, ...PARTNER_LOGOS].map((partner, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 mx-4 w-32 h-20 bg-white rounded-lg border border-border flex items-center justify-center p-3 shadow-sm"
                  >
                    <img
                      src={partner.src}
                      alt={partner.name}
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = `<span class="text-xs text-muted-foreground font-medium text-center">${partner.name}</span>`;
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Application Form Section */}
        <section className="py-12 px-4 md:py-16 bg-muted/30">
          <div className="container max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h3 className="text-2xl md:text-3xl font-bold mb-3">
                Apply Now
              </h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Fill out the form below to apply and become part of the Snappy family.
              </p>
            </div>

            <AmbassadorPreboardingForm />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-6 px-4 border-t border-border mt-auto">
        <div className="container max-w-5xl mx-auto text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Questions? Contact us at ambassadors@gosnappy.io for assistance.
          </p>
          <a
            href="https://gosnappy.io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline"
          >
            gosnappy.io
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Index;
