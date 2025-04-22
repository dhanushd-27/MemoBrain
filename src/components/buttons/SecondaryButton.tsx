import { SecondaryButtonProps } from "@/types/button.types";
import { Button } from "../ui/button";
import Link from "next/link";


export default function SecondaryButton({
  buttonName,
  url,
  target
}: SecondaryButtonProps) {
  return (
    <Button variant={ "outline" }>
      <Link href={ url } target={ target }>
        { buttonName }
      </Link>
    </Button>
  )
}
