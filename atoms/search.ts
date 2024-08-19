import { atom } from "jotai";

type FilterType = {
  search: string;
  filters: Record<string, (string | null)[]>;
  selectedFilters: Record<string, (string | null)[]>;
  renderController: number;
};

const initialFilterState = {};

export const filterAtom = atom<FilterType>({
  search: "",
  filters: initialFilterState,
  selectedFilters: initialFilterState,
  renderController: 0,
});
