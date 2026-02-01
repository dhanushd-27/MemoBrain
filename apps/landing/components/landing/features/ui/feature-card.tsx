import { cn } from "@repo/ui";

interface FeatureCardProps {
  name: string;
  description: string;
  className?: string;
}

export const FeatureCard = ({
  name,
  description,
  className,
}: FeatureCardProps) => {
  return (
    <div
      className={cn(
        "flex flex-col justify-between border border-border-muted rounded-2xl p-6 hover:border-border-strong transition-colors bg-surface-muted",
        className,
      )}
    >
      <div>
        <dt className="text-xl font-semibold leading-7 text-foreground font-serif">
          {name}
        </dt>
        <dd className="mt-2 text-sm leading-7 text-muted-foreground">
          {description}
        </dd>
      </div>
    </div>
  );
};
