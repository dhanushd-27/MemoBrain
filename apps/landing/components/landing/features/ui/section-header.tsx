import { Capsule } from "@repo/ui";

interface SectionHeaderProps {
  capsuleText: string;
  title: string;
  description: string;
}

export const SectionHeader = ({
  capsuleText,
  title,
  description,
}: SectionHeaderProps) => {
  return (
    <div className="mx-auto max-w-2xl lg:text-center">
      <div className="flex justify-center mb-4">
        <Capsule text={capsuleText} />
      </div>
      <h3 className="mt-2 text-h3 italic text-foreground">{title}</h3>
      <p className="ml-2 mt-3 text-md leading-8 text-muted-foreground">
        {description}
      </p>
    </div>
  );
};
