import Link from "next/link";
import Image from "next/image";

export const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Image
        src="/logo.png"
        alt="CoBrain Logo"
        width={32}
        height={32}
        className="w-8 h-8 rounded-full"
      />
      <span className="text-2xl font-serif font-bold text-foreground">
        CoBrain
      </span>
    </Link>
  );
};
