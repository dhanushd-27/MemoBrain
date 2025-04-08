"use server"

import { Response } from "@/types/status-code.types";
import { SignUpSchema, SignUpZodSchema } from "@/types/user.types";
import { prisma } from "@/utils/prisma";
import argon2 from 'argon2'

export const SignUpAction = async (payload: SignUpSchema) => {
  try {
    const parsedData = SignUpZodSchema.safeParse(payload);

    if(!parsedData.data && !parsedData.success) {
      throw {
        status: Response.InvalidData,
        message: "Request's Consist of Invalid Data"
      };
    }

    const { username, email, password } = parsedData.data;

    const isFound = await prisma.user.findFirst({
      where: {
        email
      }
    });

    if(isFound) throw {
      status: Response.Conflict,
      message: "User Already Exists"
    }

    const hashedPassword = await argon2.hash(password);

    await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword
      }
    });

    return {
      status: Response.Created,
      message: "User Created Successfully"
    }
  } catch (error) {
    const e = error as {
      status: number,
      message: string
    }
    return {
      status: e.status,
      message: e.message
    }
  }
};