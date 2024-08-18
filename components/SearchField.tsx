"use client";

import { useEffect } from "react";
import FilterBox from "./FilterBox";
import { useAtom, useAtomValue } from "jotai";
import filterSchema from "@/common/schemas/filter";
import { filterAtom } from "@/atoms/search";

export default function SearchField() {
  const [filter, setFilter] = useAtom(filterAtom);

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
      if (filter.search !== "") queryParams.append("search", filter.search);

      const response = await fetch(url);
      const data = await response.json();
      const result = filterSchema.safeParse(data);

      if (!result.success) {
        console.error(result.error);
        return;
      }

      setFilter({
        ...filter,
        filters: result.data,
      });
    }

    fetchData();
  }, [filter.search]);

  return (
    <div>
      <div className="flex overflow-x-auto p-5 gap-5">
        {Object.entries(filter.filters).map(([key, value]) => {
          if (!(value.length === 1 && value[0] === null))
            return (
              <FilterBox key={key} filter={{ name: key, values: value }} />
            );
        })}
      </div>
    </div>
  );
}
