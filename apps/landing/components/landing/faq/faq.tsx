import { Capsule } from "@repo/ui";
import { Accordion } from "./accordion";
import content from "../../../content/landing.json";

export const FAQ = () => {
  return (
    <section
      id="faq"
      className="py-24 px-6 sm:py-32 lg:px-8 bg-background relative overflow-hidden"
    >
      {/* Subtle background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,var(--color-primary)_0%,transparent_70%)] opacity-[0.03] pointer-events-none" />

      <div className="mx-auto max-w-3xl relative z-10">
        <div className="flex flex-col items-center text-center mb-16">
          <Capsule text={content.faq.capsule_title} className="mb-6" />
          <h2 className="text-h2 italic text-foreground mb-4">
            {content.faq.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
            {content.faq.description}
          </p>
        </div>
        <Accordion items={content.faq.items} />
      </div>
    </section>
  );
};
