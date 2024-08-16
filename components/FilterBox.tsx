import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "./ui/separator";
import type { Filter } from "@/common/types/Filter";

function FilterItem({ value }: { value: string }) {
  return (
    <div>
      <button>{value}</button>
    </div>
  );
}

export default function FilterBox({ filter }: { filter: Filter }) {
  return (
    <Card className="flex-none w-64 ">
      <CardHeader className="text-center">
        <CardTitle>{filter.name}</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="text-center p-0 overflow-y-auto h-48">
        {filter.values.map((value, index) => {
          if (value) return <FilterItem key={index} value={value} />;
        })}
      </CardContent>
    </Card>
  );
}
