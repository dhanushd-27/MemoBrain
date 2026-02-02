import Link from "next/link";
import { Button } from "@repo/ui";
import content from "../../../../content/landing.json";

export const HomeHero = () => {
  return (
    <div className="relative z-10 flex flex-col items-center w-full max-w-5xl">
      <h1 className="text-h2 text-foreground text-center italic">
        {content.home.title}
      </h1>
      <p className="mt-6 text-body text-muted-foreground text-center max-w-lg md:max-w-xl lg:max-w-2xl px-4">
        {content.home.description}
      </p>
      <div className="mt-10 flex flex-col w-full sm:w-auto sm:flex-row items-center justify-center gap-4 sm:gap-x-6 px-4">
        <Link href="/signup" className="w-full sm:w-auto">
          <Button variant="contained" className="w-full sm:w-auto">
            {content.home.buttons.primary}
          </Button>
        </Link>
        <Link href="/signin" className="w-full sm:w-auto">
          <Button variant="texted" className="w-full sm:w-auto">
            {content.home.buttons.secondary} <span aria-hidden="true">→</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};
