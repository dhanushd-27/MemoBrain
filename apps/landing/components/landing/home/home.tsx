import { HomeBackground } from "./ui/home-background";
import { HomeHero } from "./ui/home-hero";

export const Home = () => {
  return (
    <section
      id="home"
      className="relative flex min-h-screen flex-col items-center justify-center py-24 text-center px-4 overflow-hidden"
    >
      <HomeBackground />
      <HomeHero />
    </section>
  );
};
