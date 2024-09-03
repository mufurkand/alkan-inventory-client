import PartTable from "@/components/PartTable";
import SearchField from "@/components/SearchField";
import { Separator } from "@/components/ui/separator";

export default function Parts() {
  return (
    <div>
      <SearchField />
      <Separator />
      <PartTable />
    </div>
  );
}
