import { ApiError } from "./api-error";

type AsyncHandlerResult<T> =
  | { data: T }
  | { error: true; errorInformation: ApiError | unknown };

export function AsyncHandler<TArgs extends any[], TResult>(
  func: (...args: TArgs) => Promise<TResult>
) {
  return async (...args: TArgs): Promise<AsyncHandlerResult<TResult>> => {
    try {
      const data = await func(...args);
      return { data };
    } catch (error) {
      const e = error as ApiError;
      return {
        error: true,
        errorInformation: e,
      };
    }
  };
}
