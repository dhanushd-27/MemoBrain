"use client"

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return <>
    <Button onClick={ () => { router.push("/login") } }>Login</Button>
    <Button onClick={ () => { router.push("/signup") } }>SignUp</Button>
  </>;
}
