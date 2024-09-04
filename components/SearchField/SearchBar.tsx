import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Search } from "lucide-react";
import { filterAtom } from "@/atoms/filter";
import { useAtom } from "jotai";
import { useRef } from "react";

export default function SearchBar() {
  const [filter, setFilter] = useAtom(filterAtom);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSearchSubmit() {
    if (!inputRef.current) return;

    setFilter({ ...filter, search: inputRef.current.value });
  }

  return (
    // take a look at the SearchField component for pr-5 padding explanation
    <div className="flex gap-5 pr-5 flex-grow">
      <Input
        onKeyDown={(event) => {
          if (event.key === "Enter") handleSearchSubmit();
        }}
        placeholder="Parça No ya da ürün tanımı girin."
        ref={inputRef}
      />
      <Button onClick={handleSearchSubmit}>
        <Search />
      </Button>
    </div>
  );
}
