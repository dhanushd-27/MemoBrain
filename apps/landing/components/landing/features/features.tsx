import content from "../../../content/landing.json";
import { FeatureCard } from "./ui/feature-card";
import { SectionHeader } from "./ui/section-header";

export const Features = () => {
  return (
    <section id="features" className="py-24 sm:py-32 bg-secondary/10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader
          capsuleText={content.features.section_title}
          title={content.features.main_title}
          description={content.features.description}
        />
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:grid-rows-2">
            {content.features.list.map((feature, idx) => (
              <FeatureCard
                key={feature.name}
                name={feature.name}
                description={feature.description}
                className={
                  idx === 0
                    ? "lg:col-span-2"
                    : idx === 1
                      ? "lg:col-span-1"
                      : idx === 2
                        ? "lg:col-span-1"
                        : "lg:col-span-2"
                }
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
