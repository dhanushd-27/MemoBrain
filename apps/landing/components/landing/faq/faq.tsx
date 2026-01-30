const faqs = [
  {
    question: "What is CoBrain?",
    answer:
      "CoBrain is an AI-powered second brain that helps you capture, organize, and retrieve your thoughts and information effortlessly.",
  },
  {
    question: "Is it free?",
    answer:
      "We offer a generous free tier for individuals. Power users can upgrade to Pro for more storage and advanced AI features.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes, security is our top priority. All your data is encrypted directly on your device before syncing.",
  },
];

export const FAQ = () => {
  return (
    <section id="faq" className="py-24 px-6 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-2xl divide-y divide-border">
        <h2 className="text-2xl font-bold leading-10 tracking-tight text-foreground">
          Frequently asked questions
        </h2>
        <dl className="mt-10 space-y-6 divide-y divide-border">
          {faqs.map((faq) => (
            <div key={faq.question} className="pt-6">
              <dt>
                <button className="flex w-full items-start justify-between text-left text-foreground">
                  <span className="text-base font-semibold leading-7">
                    {faq.question}
                  </span>
                </button>
              </dt>
              <dd className="mt-2 pr-12">
                <p className="text-base leading-7 text-muted-foreground">
                  {faq.answer}
                </p>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};
