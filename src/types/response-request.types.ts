import { ErrorType } from "./error.types";

export type ResponseType = {
  status: number,
  message: string,
  data: unknown
}

export type ActionResponse = ResponseType | ErrorType