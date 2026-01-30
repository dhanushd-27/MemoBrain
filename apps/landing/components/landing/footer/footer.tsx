import Link from "next/link";
import Image from "next/image";
import { Button } from "@repo/ui";
import { logo } from "@assets";
import content from "../../../content/landing.json";

export const Footer = () => {
  return (
    <footer className="bg-background border-t border-border mt-20">
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Logo & Info */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Image
                src={logo}
                alt="CoBrain Logo"
                width={32}
                height={32}
                className="w-8 h-8 rounded-full"
              />
              <span className="text-2xl font-serif font-bold text-foreground">
                CoBrain
              </span>
            </div>
            <p className="text-muted-foreground text-base max-w-sm leading-relaxed">
              {content.footer.description}
            </p>
            <Link href="/signup" className="inline-block">
              <Button variant="contained">Get Started</Button>
            </Link>
          </div>

          {/* Spacer for desktop */}
          <div className="hidden lg:block"></div>

          {/* Socials Column */}
          <div className="flex flex-col gap-2">
            <h3 className="text-foreground font-semibold text-md">Socials</h3>
            <ul className="flex flex-col gap-1">
              {content.footer.socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm hover:underline"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            {content.footer.all_rights_reserved} &copy;{" "}
            {new Date().getFullYear()} CoBrain
          </p>
          <p className="text-muted-foreground text-sm font-medium">
            {content.footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
};
