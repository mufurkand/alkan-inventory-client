import { atom } from "jotai";

type UserType = {
  id: number;
  username: string;
  role: string;
} | null;

export const authAtom = atom<UserType>(null);
