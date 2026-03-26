import { Link } from "@tanstack/react-router";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-navy shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
            data-ocid="nav.link"
          >
            <img
              src="/assets/generated/fox-mascot-transparent.dim_120x120.png"
              alt="Numbrex Fox"
              className="w-10 h-10 object-contain group-hover:scale-110 transition-transform"
            />
            <span className="text-cream font-nunito font-900 text-xl tracking-tight">
              Numb<span className="text-brand-orange">rex</span>
            </span>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-cream/80 hover:text-cream font-semibold transition-colors text-sm"
              data-ocid="nav.home.link"
            >
              Home
            </Link>
            <Link
              to="/leaderboard"
              className="text-cream/80 hover:text-cream font-semibold transition-colors text-sm"
              data-ocid="nav.leaderboard.link"
            >
              Leaderboard
            </Link>
          </nav>

          {/* CTA */}
          <Link
            to="/play"
            search={{ group: undefined }}
            data-ocid="nav.play_button"
          >
            <button
              type="button"
              className="bg-brand-orange text-white font-bold text-sm px-5 py-2 rounded-full hover:opacity-90 active:scale-95 transition-all animate-pulse-glow"
            >
              PLAY NOW
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}
