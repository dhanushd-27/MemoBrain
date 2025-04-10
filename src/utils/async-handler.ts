import { ApiError } from "./api-error";

export function AsyncHandler<TArgs extends unknown[], TResult>(
  func: (...args: TArgs) => Promise<TResult>
) {
  return async (...args: TArgs) => {
    try {
      return await func(...args);
    } catch (error) {
      const e = error as ApiError;
      return {
        error: true,
        errorInformation: {
          name: e.name,
          status: e.status,
          message: e.message,
        },
      };
    }
  };
}