import content from "../../../content/landing.json";
import { Accordion } from "./ui/accordion";
import { FAQBackground } from "./ui/faq-background";
import { SectionHeader } from "./ui/section-header";

export const FAQ = () => {
  return (
    <section
      id="faq"
      className="py-24 px-6 sm:py-32 lg:px-8 bg-background relative overflow-hidden"
    >
      <FAQBackground />

      <div className="mx-auto max-w-3xl relative z-10">
        <SectionHeader
          capsuleText={content.faq.capsule_title}
          title={content.faq.title}
          description={content.faq.description}
        />
        <Accordion items={content.faq.items} />
      </div>
    </section>
  );
};
