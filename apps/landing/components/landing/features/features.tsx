import { Capsule } from "@repo/ui";
import content from "../../../content/landing.json";

export const Features = () => {
  return (
    <section id="features" className="py-24 sm:py-32 bg-secondary/10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <div className="flex justify-center mb-4">
            <Capsule text={content.features.section_title} />
          </div>
          <h3 className="mt-2 text-h3 italic text-foreground">
            {content.features.main_title}
          </h3>
          <p className="ml-2 mt-3 text-md leading-8 text-muted-foreground">
            {content.features.description}
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
            {content.features.list.map((feature) => (
              <div
                key={feature.name}
                className="flex flex-col border border-border rounded-2xl p-6 hover:border-border-strong transition-colors"
              >
                <dt className="text-xl font-semibold leading-7 text-foreground font-serif">
                  {feature.name}
                </dt>
                <dd className="mt-2 text-sm leading-7 text-muted-foreground">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
};
