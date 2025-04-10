export enum ErrorMessage {
  InvalidData = "Invalid Data Form Data",
  UserExists = "User Already Exists",
}

export type ErrorType = {
  error: boolean;
  errorInformation: {
    name: string;
    status: number;
    message: string;
  };
};