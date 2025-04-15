"use client";

import { handleSession } from "@/actions/handleSession";
import { isErrorResponse } from "@/utils/api-response-handler";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      const response = await handleSession();
        router.push('/dashboard')
      if (!isErrorResponse(response)) {
        
      }
    };

    init();
  }, []);

  return <>
    Landing page
  </>;
}
