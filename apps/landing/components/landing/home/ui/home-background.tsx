export const HomeBackground = () => {
  return (
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
  );
};
