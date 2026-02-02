import Link from "next/link";
import { Button } from "@repo/ui";
import content from "../../../content/landing.json";
import { SocialLinks } from "./ui/social-links";
import { FooterCopyright } from "./ui/footer-copyright";
import { FooterLogo } from "./ui/footer-logo";

export const Footer = () => {
  return (
    <footer className="bg-background border-t border-border mt-20">
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Logo & Info */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <FooterLogo />
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
          <SocialLinks links={content.footer.socials} />
        </div>

        {/* Bottom Bar */}
        <FooterCopyright
          allRightsReservedText={content.footer.all_rights_reserved}
          copyrightText={content.footer.copyright}
        />
      </div>
    </footer>
  );
};
