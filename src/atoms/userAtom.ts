import { atom } from "recoil";

interface User {
  id: string;
  email: string | null;
  nickname: string;
  isSeller: boolean;
}

export const userState = atom<User | null>({
  key: "userState",
  default: null,
});
