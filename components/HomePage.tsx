import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserTab from "./HomePage/UserTab";
import { Button } from "./ui/button";
import { Table } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Homepage() {
  const router = useRouter();

  function handleTableClick() {
    router.push("/parts");
  }

  return (
    <div className="h-screen flex justify-center items-center">
      <Tabs defaultValue="users" className="md:w-2/3">
        <div className="flex gap-5 justify-center md:justify-normal">
          <TabsList>
            <TabsTrigger value="users">Kullanıcılar</TabsTrigger>
            <TabsTrigger value="parts">Parçalar</TabsTrigger>
          </TabsList>
          <Button onClick={handleTableClick} className="flex gap-2">
            <Table />
            <p>Envanter</p>
          </Button>
        </div>
        <TabsContent value="users" className="mt-5">
          <UserTab />
        </TabsContent>
        <TabsContent value="parts">placeholder</TabsContent>
      </Tabs>
    </div>
  );
}
