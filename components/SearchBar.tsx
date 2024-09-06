import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { useRef } from "react";

export default function SearchBar({
  setSearch,
  placeholder,
}: {
  setSearch: (search: string) => void;
  placeholder?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSearchSubmit() {
    if (!inputRef.current) return;

    setSearch(inputRef.current.value);
  }

  return (
    <div className="flex gap-5 flex-grow">
      <Input
        onKeyDown={(event) => {
          if (event.key === "Enter") handleSearchSubmit();
        }}
        placeholder={placeholder}
        ref={inputRef}
      />
      <Button onClick={handleSearchSubmit}>
        <Search />
      </Button>
    </div>
  );
}
