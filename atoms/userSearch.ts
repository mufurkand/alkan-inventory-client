import { atom } from "jotai";

type UserType = {
  search: string;
  renderController: number;
};

// TODO: split this into seperate atoms
export const userSearchAtom = atom<UserType>({
  search: "",
  renderController: 0,
});
