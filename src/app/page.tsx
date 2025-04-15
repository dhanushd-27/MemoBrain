"use client";

import { handleSession } from "@/actions/handleSession";
import { useTokenStore } from "@/lib/store/tokenStore";
import { isErrorResponse } from "@/utils/api-response-handler";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { setAccessToken } = useTokenStore()

  useEffect(() => {
    const init = async () => {
      const response = await handleSession();
      if (!isErrorResponse(response)) {
        const { sessionToken } = response.data as { sessionToken: string};
        setAccessToken(sessionToken);
        router.push('/dashboard');
      }
    };

    init();
  });

  return <>
    Landing page
  </>;
}
