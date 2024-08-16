"use client";

import { useEffect } from "react";
import FilterBox from "./FilterBox";
import { atom, useAtom } from "jotai";
import filterSchema from "@/common/schemas/filter";
import type { Filter } from "@/common/types/Filter";

type SearchType = {
  search: string;
  filters: Filter[];
};

const searchAtom = atom<SearchType>({
  search: "",
  filters: [],
});

export default function SearchField() {
  const [search, setSearch] = useAtom(searchAtom);

  useEffect(() => {
    async function fetchData() {
      if (!process.env.NEXT_PUBLIC_API_URL) {
        console.error("API URL is not defined.");
        return;
      }

      const url = new URL(
        process.env.NEXT_PUBLIC_API_URL + "/api/parts/filters"
      );
      let queryParams = new URLSearchParams();
      if (search.search !== "") queryParams.append("search", search.search);

      const response = await fetch(url);
      const data = await response.json();
      const result = filterSchema.safeParse(data);

      if (!result.success) {
        console.error(result.error);
        return;
      }

      console.log(result.data);

      const filters: Filter[] = Object.entries(result.data).map(
        ([name, values]) => ({
          name,
          values,
        })
      );

      console.log(filters);

      setSearch({ ...search, filters });
    }

    fetchData();
  }, [search.search]);

  return (
    <div>
      <div className="flex overflow-x-auto p-5 gap-5">
        {search.filters.map((filter) => (
          <FilterBox key={filter.name} filter={filter} />
        ))}
      </div>
    </div>
  );
}
