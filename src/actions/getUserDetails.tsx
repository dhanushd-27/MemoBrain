"use server"

import { accessTokenName } from "@/utils/env/env";
import { verifyAccessToken } from "@/utils/token/verifyTokens/verify-access-token";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const getUserDetails = async () => {
  const accessTokenCookie = (await cookies()).get(accessTokenName);

  if(!accessTokenCookie){ 
    redirect("/login");
  }

  const accessToken = accessTokenCookie.value;

  const payload = await verifyAccessToken(accessToken);

  if(!payload) redirect('/login');

  const username = payload.username as string;
  const email = payload.email as string;

  return {
    name: username,
    email: email
  }
};