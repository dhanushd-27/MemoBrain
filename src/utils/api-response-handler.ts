class ApiResponse<T = undefined> {
  status: number;
  message: string;
  data: T | undefined

  constructor (status: number, message: string, data?: T) {
    this.status = status;
    this.message = message;
    this.data = data;
  }
}

export { ApiResponse }