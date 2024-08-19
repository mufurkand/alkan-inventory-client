"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SquarePen, Trash2 } from "lucide-react";

import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import responseSchema from "@/lib/schemas/response";
import partSchema from "@/lib/schemas/part";
import { useAtomValue } from "jotai";
import { filterAtom } from "@/atoms/search";
import PartForm from "./PartForm";

function Row({ part }: { part: z.infer<typeof partSchema> }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <TableRow key={part.id}>
      <TableCell>{part.materialType}</TableCell>
      <TableCell>{part.partNumber}</TableCell>
      <TableCell>{part.location}</TableCell>
      <TableCell>{part.price || "-"}</TableCell>
      <TableCell>{part.quantity || "-"}</TableCell>
      <TableCell>{part.channel || "-"}</TableCell>
      <TableCell>{part.caseType || "-"}</TableCell>
      <TableCell>{part.voltage || "-"}</TableCell>
      <TableCell>{part.current || "-"}</TableCell>
      <TableCell>{part.value || "-"}</TableCell>
      <TableCell>{part.unit || "-"}</TableCell>
      <TableCell>{part.power || "-"}</TableCell>
      <TableCell>{part.description || "-"}</TableCell>
      <TableCell className="text-center">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger>
            <SquarePen />
          </SheetTrigger>
          <SheetContent className="overflow-y-auto">
            <SheetHeader className="mb-5">
              <SheetTitle>Parça Güncelle</SheetTitle>
              <SheetDescription>
                Parçanın herhangi bir bilgisini buradan güncelleyebilirsiniz.
              </SheetDescription>
            </SheetHeader>
            <PartForm part={part} mode="PATCH" setIsOpen={setIsOpen} />
          </SheetContent>
        </Sheet>
      </TableCell>
      <TableCell className="text-center">
        <button>
          <Trash2 />
        </button>
      </TableCell>
    </TableRow>
  );
}

export default function PartTable() {
  const [data, setData] = useState<z.infer<typeof partSchema>[]>([]);
  const [pending, setPending] = useState(true);
  const [pagination, setPagination] = useState({ limit: 10, offset: 0 });
  const [pageInfo, setPageInfo] = useState<{
    nextPage: number | boolean;
    prevPage: number | boolean;
  }>({ nextPage: false, prevPage: false });
  const filter = useAtomValue(filterAtom);

  const page = useMemo(
    () => pagination.offset / pagination.limit + 1,
    [pagination]
  );

  const isNextButtonDisabled = useMemo(
    () => typeof pageInfo.nextPage === "boolean",
    [pageInfo]
  );

  const isPrevButtonDisabled = useMemo(
    () => typeof pageInfo.prevPage === "boolean",
    [pageInfo]
  );

  useEffect(() => {
    async function fetchData() {
      console.log("fetch triggered");
      if (!process.env.NEXT_PUBLIC_API_URL) {
        console.error("API URL is not defined.");
        return;
      }

      const url = new URL(
        process.env.NEXT_PUBLIC_API_URL + "/api/parts/search"
      );
      let queryParams = new URLSearchParams();
      if (pagination.limit !== 10)
        queryParams.append("limit", pagination.limit.toString());
      if (pagination.offset !== 0)
        queryParams.append("offset", pagination.offset.toString());
      url.search = queryParams.toString();

      const searchBody = {
        search: filter.search === "" ? undefined : filter.search,
        filters:
          Object.keys(filter.selectedFilters).length > 0
            ? filter.selectedFilters
            : undefined,
      };

      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(searchBody),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      const result = responseSchema.safeParse(data);

      if (!result.success) {
        console.error(result.error);
        console.error(result);
        return;
      }
      setPageInfo({
        nextPage: result.data.nextPage,
        prevPage: result.data.prevPage,
      });
      setData(result.data.data);
      setPending(false);
    }

    fetchData();
  }, [
    pagination,
    filter.selectedFilters,
    filter.search,
    filter.renderController,
  ]);

  function handlePagination(direction: "forward" | "backward") {
    if (direction === "forward") {
      setPagination({
        ...pagination,
        offset: typeof pageInfo.nextPage === "number" ? pageInfo.nextPage : 0,
      });
    }
    if (direction === "backward") {
      setPagination({
        ...pagination,
        offset: typeof pageInfo.prevPage === "number" ? pageInfo.prevPage : 0,
      });
    }
  }

  if (pending) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Malzeme Tipi</TableHead>
            <TableHead>Parça Numarası</TableHead>
            <TableHead>Yer</TableHead>
            <TableHead>Ücret</TableHead>
            <TableHead>Adet</TableHead>
            <TableHead>Kanal</TableHead>
            <TableHead>Kılıf Tipi</TableHead>
            <TableHead>Voltaj</TableHead>
            <TableHead>Akım</TableHead>
            <TableHead>Değer</TableHead>
            <TableHead>Birim</TableHead>
            <TableHead>Güç</TableHead>
            <TableHead>Tanım</TableHead>
            <TableHead>Güncelle</TableHead>
            <TableHead>Sil</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((part) => (
            <Row key={part.id} part={part} />
          ))}
        </TableBody>
      </Table>
      <Pagination className="justify-end">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              className={
                isPrevButtonDisabled
                  ? "pointer-events-none opacity-50"
                  : undefined
              }
              tabIndex={isPrevButtonDisabled ? -1 : undefined}
              href="#"
              onClick={() => handlePagination("backward")}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink className="pointer-events-none" href="#">
              {page}
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              className={
                isNextButtonDisabled
                  ? "pointer-events-none opacity-50"
                  : undefined
              }
              tabIndex={isNextButtonDisabled ? -1 : undefined}
              href="#"
              onClick={() => handlePagination("forward")}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}