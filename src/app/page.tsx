"use client"

import Tag from "@/components/Tag";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { tagColorPalette } from "@/utils/other/colorStore";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log(e.key);
  }

  return <>
    <Button onClick={ () => { router.push("/login") } }>Login</Button>
    <Button onClick={ () => { router.push("/signup") } }>SignUp</Button>
    <Tag tagTitle="standard" color={ tagColorPalette[0] }/>
    <Input onKeyDown={ onKeyDown }/>
  </>;
}
