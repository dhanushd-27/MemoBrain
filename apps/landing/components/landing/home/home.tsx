import { Button } from "@repo/ui";

export const Home = () => {
  return (
    <section
      id="home"
      className="flex min-h-screen flex-col items-center justify-center py-24 text-center px-4"
    >
      <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-foreground">
        Welcome to CoBrain
      </h1>
      <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl">
        Your second brain, supercharged. enhance your productivity with
        AI-driven insights and seamless memory management.
      </p>
      <div className="mt-10 flex items-center justify-center gap-x-6">
        <Button variant="contained">Get started</Button>
        <Button variant="texted">
          Learn more <span aria-hidden="true">→</span>
        </Button>
      </div>
    </section>
  );
};
