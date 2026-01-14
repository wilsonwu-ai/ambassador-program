import { AmbassadorPreboardingForm } from "@/components/preboarding/AmbassadorPreboardingForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="py-6 px-4 border-b border-border">
        <div className="container max-w-5xl mx-auto flex items-center justify-center gap-3">
          <img
            src="/ambassador-program/snappy-logo.png"
            alt="Snappy"
            className="w-10 h-10 rounded-xl"
          />
          <h1 className="text-xl font-bold">Snappy Ambassador Program</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-8 px-4 md:py-12">
        <div className="container max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Join Our Ambassador Program
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We're looking for passionate content creators to partner with. Fill out the form below to apply and become part of the Snappy family.
            </p>
          </div>

          <AmbassadorPreboardingForm />
        </div>
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
