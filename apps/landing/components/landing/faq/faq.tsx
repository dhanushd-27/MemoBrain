import { Capsule } from "@repo/ui";
import { Accordion } from "./accordion";
import content from "../../../content/landing.json";

export const FAQ = () => {
  return (
    <section id="faq" className="py-24 px-6 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-2xl divide-y divide-border">
        <div className="flex flex-col items-center mb-10">
          <Capsule text={content.faq.capsule_title} className="mb-4" />
        </div>
        <Accordion items={content.faq.items} />
      </div>
    </section>
  );
};
