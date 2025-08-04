import { PrimaryButtonProps } from "@/types/button.types";
import { Button } from "../ui/button";
import Link from "next/link";

export default function PrimaryButton({
  buttonName,
  url,
  target
}: PrimaryButtonProps) {
  return (
    <Button asChild>
      <Link href={ url } target={ target }>
        { buttonName }
      </Link>
    </Button>
  )
}
