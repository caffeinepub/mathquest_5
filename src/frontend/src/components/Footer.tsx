export function Footer() {
  const year = new Date().getFullYear();
  const utmLink = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  return (
    <footer className="bg-navy text-cream/70 py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🦊</span>
            <span className="font-bold text-cream text-lg">
              Math<span className="text-brand-orange">Quest</span>
            </span>
            <span className="text-cream/50 text-sm ml-2">
              Level up your brain!
            </span>
          </div>
          <div className="text-sm text-center">
            © {year}. Built with ❤️ using{" "}
            <a
              href={utmLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-orange hover:underline"
            >
              caffeine.ai
            </a>
          </div>
          <div className="flex gap-4 text-sm">
            <span className="text-cream/50">π</span>
            <span className="text-cream/50">Σ</span>
            <span className="text-cream/50">∞</span>
            <span className="text-cream/50">√</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
