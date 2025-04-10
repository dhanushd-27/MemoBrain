export const ApiResponse = (status: number, message: string, data?: unknown) => {
  return {
    status, 
    message,
    data
  }
}