"use client";

import { useEffect, useState } from "react";
import FilterBox from "./SearchField/FilterBox";
import { useAtom, useAtomValue } from "jotai";
import filterSchema from "@/lib/schemas/filter";
import { filterAtom } from "@/atoms/search";
import SearchBar from "./SearchField/SearchBar";
import ButtonSet from "./SearchField/ButtonSet";
import { LoaderCircle } from "lucide-react";

export default function SearchField() {
  const [filter, setFilter] = useAtom(filterAtom);
  const [isPending, setIsPending] = useState(true);

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
      url.search = queryParams.toString();

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
      setIsPending(false);
    }

    fetchData();
  }, [filter.search, filter.renderController]);

  if (isPending) {
    return (
      <div className="h-64 flex justify-center items-center gap-5">
        <LoaderCircle className="animate-spin" size={32} />
        <p>Filtreler yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="pt-5 pb-5 grid gap-5">
      <div className="flex overflow-x-auto">
        {/*
          This spaghetti margin values instead of a proper gap and padding allows us to intersect
          FilterBoxes with the screen edge when overflow happens, and act like natural padding when
          it doesn't.
        */}
        <div className="flex ml-5">
          {Object.entries(filter.filters).map(([key, value]) => {
            if (
              !(value.length === 1 && value[0] === null) &&
              value.length !== 0
            )
              return (
                <FilterBox key={key} filter={{ name: key, values: value }} />
              );
          })}
        </div>
      </div>
      <div className="flex md:flex-row flex-col gap-5 pl-5">
        <ButtonSet />
        <SearchBar />
      </div>
    </div>
  );
}
