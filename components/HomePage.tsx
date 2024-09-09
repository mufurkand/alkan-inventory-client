import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserTab from "./HomePage/UserTab";
import { Button } from "./ui/button";
import { LogOut, ShieldX, Table } from "lucide-react";
import { useRouter } from "next/navigation";
import PartTab from "./HomePage/PartTab";
import { useAtom } from "jotai";
import { authAtom } from "@/atoms/auth";

function Unauthorized() {
  return (
    <div className="flex justify-center items-center gap-2">
      <ShieldX className="text-yellow-500" />
      <p>Bu sekmeye erişiminiz bulunmamaktadır.</p>
    </div>
  );
}

export default function Homepage() {
  const router = useRouter();
  const [auth, setAuth] = useAtom(authAtom);

  function handleTableClick() {
    router.push("/parts");
  }

  function handleLogOut() {
    localStorage.removeItem("token");
    setAuth(null);
  }

  return (
    <div className="flex justify-center p-5">
      <Tabs defaultValue="users" className="grow">
        <div className="flex gap-5 justify-center md:justify-normal md:flex-row flex-col-reverse">
          <TabsList>
            <TabsTrigger value="users">Kullanıcılar</TabsTrigger>
            <TabsTrigger value="parts">Parçalar</TabsTrigger>
          </TabsList>
          <div className="flex gap-5">
            <Button onClick={handleTableClick} className="flex gap-2">
              <Table />
              <p>Envanter</p>
            </Button>
            <Button onClick={handleLogOut} className="flex gap-2">
              <LogOut />
              <p>Çıkış Yap</p>
            </Button>
          </div>
        </div>
        <TabsContent value="users" className="mt-5">
          {auth?.user.role !== "ADMIN" ? <Unauthorized /> : <UserTab />}
        </TabsContent>
        <TabsContent value="parts" className="mt-5">
          {auth?.user.role !== "ADMIN" ? <Unauthorized /> : <PartTab />}
        </TabsContent>
      </Tabs>
    </div>
  );
}
