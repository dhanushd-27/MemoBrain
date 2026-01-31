import apiClient from "../lib/axios";
import type { SignUpRequest, SignInRequest, AuthResponse } from "@repo/types";

export const signup = async (data: SignUpRequest): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>("/auth/signup", data);
  return response.data;
};

export const signin = async (data: SignInRequest): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>("/auth/signin", data);
  return response.data;
};

export const signout = async (): Promise<void> => {
  await apiClient.post("/auth/signout");
};

export const refresh = async (): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>("/auth/refresh");
  return response.data;
};
