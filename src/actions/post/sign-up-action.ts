"use server"

import { Response } from "@/types/status-code.types";
import { SignUpSchema, SignUpZodSchema } from "@/types/user.types";
import { handleResponse } from "@/utils/api-response-handler";
import { prisma } from "@/utils/prisma";
import argon2 from 'argon2'

export const SignUpAction = async (payload: SignUpSchema) => {
  try {
    const parsedData = SignUpZodSchema.safeParse(payload);

    if(!parsedData.data && !parsedData.success) {
      throw handleResponse(Response.InvalidData, "Invalid Data Form Data");
    }

    const { username, email, password } = parsedData.data;

    const isFound = await prisma.user.findFirst({
      where: {
        email
      }
    });

    if(isFound) throw handleResponse(Response.Conflict, "User Already Exists");

    const hashedPassword = await argon2.hash(password);

    await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword
      }
    });

    return handleResponse(Response.Created, "User Created Successfully")
  } catch (error) {
    const e = error as {
      status: number,
      message: string
    }
    return handleResponse(e.status, e.message);
  }
};