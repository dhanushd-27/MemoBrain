class ApiError extends Error {
  status: number;
  
  constructor(status: number, message: string) {
    super(message);
    this.status = status
    this.name = message;
  }
}

export { ApiError }