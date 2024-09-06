"use client";

import {
  Table,
  TableBody,
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
import LoadingBanner from "./LoadingBanner";
import Banner from "./Banner";
import Row from "./PartTable/Row";

import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { partsResponseSchema } from "@/lib/schemas/responses";
import partSchema from "@/lib/schemas/part";
import { useAtomValue } from "jotai";
import { filterAtom } from "@/atoms/filter";
import { authAtom } from "@/atoms/auth";

export default function PartTable() {
  const [data, setData] = useState<z.infer<typeof partSchema>[]>([]);
  const [isPending, setIsPending] = useState(true);
  const [pagination, setPagination] = useState({ limit: 10, offset: 0 });
  const [pageInfo, setPageInfo] = useState<{
    nextPage: number | boolean;
    prevPage: number | boolean;
  }>({ nextPage: false, prevPage: false });
  const filter = useAtomValue(filterAtom);
  const auth = useAtomValue(authAtom);

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
      console.warn("fetch triggered");
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
      const result = partsResponseSchema.safeParse(data);

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
      setIsPending(false);
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

  if (isPending) {
    return <LoadingBanner message="Parçalar yükleniyor..." />;
  }

  if (data.length === 0) {
    return <Banner message="Hiçbir parça bulunamadı." />;
  }

  return (
    <div className="flex flex-col">
      <Table className="text-center">
        <TableHeader>
          <TableRow>
            {/* why doesn't this inherit text-center from the table idk */}
            <TableHead className="text-center">Resim</TableHead>
            <TableHead className="text-center">Malzeme Tipi</TableHead>
            <TableHead className="text-center">Parça Numarası</TableHead>
            <TableHead className="text-center">Yer</TableHead>
            <TableHead className="text-center">Ücret</TableHead>
            <TableHead className="text-center">Adet</TableHead>
            <TableHead className="text-center">Kanal</TableHead>
            <TableHead className="text-center">Kılıf Tipi</TableHead>
            <TableHead className="text-center">Voltaj</TableHead>
            <TableHead className="text-center">Akım</TableHead>
            <TableHead className="text-center">Değer</TableHead>
            <TableHead className="text-center">Birim</TableHead>
            <TableHead className="text-center">Güç</TableHead>
            <TableHead className="text-center">Tanım</TableHead>
            {auth !== null && (
              <>
                <TableHead className="text-center" colSpan={2}>
                  İşlemler
                </TableHead>
              </>
            )}
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
              onClick={() => handlePagination("forward")}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
