import PartTable from "@/components/PartTable";
import SearchField from "@/components/SearchField";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <div>
      <SearchField />
      <Separator />
      <PartTable />
    </div>
  );
}
