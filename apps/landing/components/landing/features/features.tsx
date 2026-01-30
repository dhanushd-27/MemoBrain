import content from "../../../content/landing.json";

export const Features = () => {
  return (
    <section id="features" className="py-24 sm:py-32 bg-secondary/10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">
            {content.features.section_title}
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {content.features.main_title}
          </p>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            {content.features.description}
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
            {content.features.list.map((feature) => (
              <div key={feature.name} className="relative pl-4">
                <dt className="text-base font-semibold leading-7 text-foreground">
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-muted-foreground">
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
