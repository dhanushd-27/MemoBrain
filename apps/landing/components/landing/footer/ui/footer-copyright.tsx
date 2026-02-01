interface FooterCopyrightProps {
  allRightsReservedText: string;
  copyrightText: string;
}

export const FooterCopyright = ({
  allRightsReservedText,
  copyrightText,
}: FooterCopyrightProps) => {
  return (
    <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
      <p className="text-muted-foreground text-sm">
        {allRightsReservedText} &copy; {new Date().getFullYear()} CoBrain
      </p>
      <p className="text-muted-foreground text-sm font-medium">
        {copyrightText}
      </p>
    </div>
  );
};
