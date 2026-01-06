export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
            Welcome to <span className="text-primary">HayaHub</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Your all-in-one personal management hub
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/auth/login"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
            >
              Get Started
            </a>
            <a
              href="/dashboard"
              className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
            >
              Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
