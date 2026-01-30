import content from "../../../content/landing.json";

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
        <nav
          className="-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12"
          aria-label="Footer"
        >
          {content.footer.links.map((link) => (
            <div key={link.label} className="pb-6">
              <a
                href={link.href}
                className="text-sm leading-6 text-muted-foreground hover:text-foreground"
              >
                {link.label}
              </a>
            </div>
          ))}
        </nav>
        <p className="mt-10 text-center text-xs leading-5 text-muted-foreground">
          &copy; {new Date().getFullYear()} {content.footer.copyright}
        </p>
      </div>
    </footer>
  );
};
