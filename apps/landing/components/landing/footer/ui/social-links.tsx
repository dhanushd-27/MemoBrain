interface SocialLink {
  label: string;
  href: string;
}

interface SocialLinksProps {
  links: SocialLink[];
}

export const SocialLinks = ({ links }: SocialLinksProps) => {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-foreground font-semibold text-md">Socials</h3>
      <ul className="flex flex-col gap-1">
        {links.map((social) => (
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
  );
};
