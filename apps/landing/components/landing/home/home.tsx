import { Button } from "@repo/ui";
import Link from "next/link";
import content from "../../../content/landing.json";

export const Home = () => {
  return (
    <section
      id="home"
      className="relative flex min-h-screen flex-col items-center justify-center py-24 text-center px-4 overflow-hidden"
    >
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Linear Gradient */}
        <div
          className="absolute left-0 bottom-0 h-[50%] w-[75%] opacity-40 blur-[100px]"
          style={{
            background:
              "linear-gradient(to bottom left, var(--color-home-1) 30%, var(--color-home-2) 40%, var(--color-home-3) 50%, var(--color-home-4) 60%)",
            clipPath: "polygon(0 0, 100% 100%, 0 100%)",
          }}
        />
        <div
          className="absolute right-0 bottom-0 h-full w-[25%] opacity-40 blur-[100px]"
          style={{
            background:
              "linear-gradient(to bottom left, var(--color-home-1) 0%, var(--color-home-2) 15%, var(--color-home-3) 20%, var(--color-home-4) 25%)",
            clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
          }}
        />
      </div>

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
    </section>
  );
};
