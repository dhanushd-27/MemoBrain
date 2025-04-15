import { create } from "zustand"

interface tokenStore {
  accessToken: string,
  setAccessToken: (newAccessToken: string) => void,
  removeAccessToken: () => void
}

export const useTokenStore = create<tokenStore>(set => ({
  accessToken: "",
  setAccessToken: (newAccessToken: string) => set({
    accessToken: newAccessToken
  }),
  removeAccessToken: () => set({
    accessToken: ""
  })
}));