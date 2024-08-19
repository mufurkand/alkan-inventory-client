import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Search } from "lucide-react";
import { filterAtom } from "@/atoms/search";
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
    <div className="p-5 flex gap-5 pt-3">
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
