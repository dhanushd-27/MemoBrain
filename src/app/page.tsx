"use client"

import Tag from "@/components/Tag";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return <>
    <Button onClick={ () => { router.push("/login") } }>Login</Button>
    <Button onClick={ () => { router.push("/signup") } }>SignUp</Button>
    <Tag tagTitle="standard"/>
  </>;
}
