"use server"

import argon2 from "argon2";
import { Response } from "@/types/status-code.types";
import { SignInSchema, SignInZodSchema } from "@/types/user.types";
import { handleResponse } from "@/utils/api-response-handler";
import { prisma } from "@/utils/prisma";

export const SignInAction = async (payload: SignInSchema) => {
  try {
    const parsedData = SignInZodSchema.safeParse(payload);

    if(!parsedData.data && !parsedData.success)  throw handleResponse(Response.InvalidData, "Invalid Data Form Data");

    const { email, password } = parsedData.data;

    const isFound = await prisma.user.findFirst({
      where: {
        email
      }
    });

    if(!isFound) throw handleResponse(Response.NotFound, "User Doesn't Exist");

    const isValid = argon2.verify(isFound.password, password);

    if(!isValid) {
      throw handleResponse(Response.Unauthorized, "Invalid Password")
    }

    return handleResponse(Response.Accepted, "User Logged In Successfully")
  } catch (error) {
    const e = error as {
      status: number,
      message: string
    }
    return handleResponse(e.status, e.message);
  }
};