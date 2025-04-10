import { ErrorType } from "@/types/error.types";
import { ActionResponse } from "@/types/response-request.types"

export const ApiResponse = (status: number, message: string, data?: unknown) => {
  return {
    status, 
    message,
    data
  }
}

export const isErrorResponse = (response: ActionResponse): response is ErrorType => {
  if('error' in response && response.error === true) return true;
  return false;
}