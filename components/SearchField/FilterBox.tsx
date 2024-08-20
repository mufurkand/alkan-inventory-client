import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import filterCategories from "@/lib/constants/filterCategories";
import type { Filter } from "@/lib/types/Filter";
import { useAtom } from "jotai";
import { filterAtom } from "@/atoms/search";
import { useMemo } from "react";

function FilterItem({ name, value }: { name: string; value: string }) {
  const [filter, setFilter] = useAtom(filterAtom);

  const selectedFilters = filter.selectedFilters[name];

  const isSelected = useMemo(() => {
    return selectedFilters?.includes(value);
  }, [selectedFilters]);

  function handleClick() {
    if (isSelected) {
      setFilter((prev) => {
        const selectedFilters = prev.selectedFilters[name].filter(
          (filter) => filter !== value
        );

        const updatedFilters = {
          ...prev.selectedFilters,
          [name]: selectedFilters,
        };

        if (selectedFilters.length === 0) {
          delete updatedFilters[name];
        }

        return {
          ...prev,
          selectedFilters: updatedFilters,
        };
      });
    } else {
      setFilter((prev) => {
        const selectedFilters = prev.selectedFilters[name] || [];
        return {
          ...prev,
          selectedFilters: {
            ...prev.selectedFilters,
            [name]: [...selectedFilters, value],
          },
        };
      });
    }
  }

  return (
    <button
      className={`w-full p-2 text-sm text-center ${
        isSelected ? "bg-blue-500 text-white" : "bg-gray-100"
      }`}
      onClick={handleClick}
    >
      {value}
    </button>
  );
}

export default function FilterBox({ filter }: { filter: Filter }) {
  return (
    // take a look at the SearchField component for mr-5 explanation
    <Card className="flex-none w-64 mr-5">
      <CardHeader className="text-center p-3">
        <CardTitle>{filterCategories[filter.name]}</CardTitle>
      </CardHeader>
      <CardContent className="text-center p-0 overflow-y-auto h-48 flex flex-col gap-1">
        {filter.values.map((value, index) => {
          if (value)
            return <FilterItem key={index} name={filter.name} value={value} />;
        })}
      </CardContent>
    </Card>
  );
}
