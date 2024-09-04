import { atom } from "jotai";

type FilterType = {
  search: string;
  filters: Record<string, (string | null)[]>;
  selectedFilters: Record<string, (string | null)[]>;
  renderController: number;
};

// TODO: split this into seperate atoms
export const filterAtom = atom<FilterType>({
  search: "",
  filters: {},
  selectedFilters: {},
  renderController: 0,
});
