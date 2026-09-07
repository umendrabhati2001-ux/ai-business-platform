import Button from "@/components/ui/Button";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500 font-bold text-white">
            AI
          </div>

          <div>
            <h1 className="text-lg font-bold text-white">
              AI Business Platform
            </h1>

            <p className="text-xs text-slate-400">
              Enterprise SaaS
            </p>
          </div>
        </div>

        {/* Menu */}
        <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
          <a href="#" className="transition hover:text-cyan-400">
            Home
          </a>

          <a href="#" className="transition hover:text-cyan-400">
            Features
          </a>

          <a href="#" className="transition hover:text-cyan-400">
            Pricing
          </a>

          <a href="#" className="transition hover:text-cyan-400">
            Docs
          </a>

          <a href="#" className="transition hover:text-cyan-400">
            Contact
          </a>
        </nav>

        {/* Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <Button variant="secondary">
            Login
          </Button>

          <Button variant="primary">
            Get Started
          </Button>
        </div>

      </div>
    </header>
  );
}