import { atom } from "jotai";

type UserType = {
  user: { id: number; username: string; role: string };
  token: string;
} | null;

export const authAtom = atom<UserType>(null);
