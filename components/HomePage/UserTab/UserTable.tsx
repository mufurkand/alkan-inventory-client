"use client";

import { authAtom } from "@/atoms/auth";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usersResponseSchema } from "@/lib/schemas/responses";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { z } from "zod";
import Row from "./UserTable/Row";
import { userSearchAtom } from "@/atoms/userSearch";

export default function UserTable() {
  const [data, setData] = useState<z.infer<typeof usersResponseSchema>>([]);
  const auth = useAtomValue(authAtom);
  const userSearch = useAtomValue(userSearchAtom);

  useEffect(() => {
    async function fetchUsers() {
      if (!process.env.NEXT_PUBLIC_API_URL) {
        console.error("API URL is not defined");
        return;
      }

      // TODO: transition to search api
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/api/users",
        {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
          },
        }
      );
      const data = await response.json();

      const result = usersResponseSchema.safeParse(data);
      if (!result.success) {
        console.error(result.error);
        return;
      }

      setData(data);
    }

    fetchUsers();
  }, [userSearch.renderController, userSearch.search]);

  return (
    <Table className="text-center">
      <TableHeader>
        <TableRow>
          <TableHead className="text-center">Kullanıcı Adı</TableHead>
          <TableHead className="text-center">Rolü</TableHead>
          <TableHead className="text-center" colSpan={2}>
            İşlemler
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((user) => (
          <Row key={user.id} user={user} />
        ))}
      </TableBody>
    </Table>
  );
}
