import { Capsule } from "@repo/ui";
import { cn } from "@repo/ui";

interface SectionHeaderProps {
  capsuleText: string;
  title: string;
  description: string;
  className?: string;
}

export const SectionHeader = ({
  capsuleText,
  title,
  description,
  className,
}: SectionHeaderProps) => {
  return (
    <div
      className={cn("flex flex-col items-center text-center mb-16", className)}
    >
      <Capsule text={capsuleText} className="mb-6" />
      <h2 className="text-h2 italic text-foreground mb-4">{title}</h2>
      <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
        {description}
      </p>
    </div>
  );
};
