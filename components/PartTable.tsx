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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { LoaderCircle } from "lucide-react";
import { SquarePen, Trash2 } from "lucide-react";
import { ImageOff } from "lucide-react";

import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { tableResponseSchema } from "@/lib/schemas/responses";
import partSchema from "@/lib/schemas/part";
import { useAtomValue, useAtom } from "jotai";
import { filterAtom } from "@/atoms/search";
import PartForm from "./PartForm";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

function Row({ part }: { part: z.infer<typeof partSchema> }) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [isBrokenImage, setIsBrokenImage] = useState(false);
  const [filter, setFilter] = useAtom(filterAtom);

  async function handleDelete() {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      console.error("API URL is not defined.");
      return;
    }

    const url = new URL(
      process.env.NEXT_PUBLIC_API_URL + "/api/parts/" + part.id
    );

    const response = await fetch(url, {
      method: "DELETE",
    });
    const data = await response.json();
    const result = partSchema.safeParse(data);

    if (!result.success) {
      console.error(result.error);
      console.error(result);
      return;
    }

    let selectedFilters = filter.selectedFilters;

    Object.entries(part).forEach(([key, value]) => {
      if (selectedFilters[key] === undefined) return;

      if (typeof value === "string" && selectedFilters[key].includes(value))
        selectedFilters[key] = selectedFilters[key].filter(
          (filter) => filter !== value
        );

      if (selectedFilters[key].length === 0) {
        delete selectedFilters[key];
      }
    });

    setIsAlertDialogOpen(false);
    setFilter({
      ...filter,
      selectedFilters,
      renderController: filter.renderController - 1,
    });
  }

  function handleBrokenImage() {
    setIsBrokenImage(true);
  }

  return (
    <TableRow key={part.id}>
      <TableCell className="flex justify-center items-center">
        {isBrokenImage ? (
          <div className="h-16 w-16 flex justify-center items-center">
            <ImageOff />
          </div>
        ) : (
          <Link
            target="_blank"
            href={process.env.NEXT_PUBLIC_API_URL + "/" + part.imagePath}
          >
            <div className="h-16 w-16 flex justify-center items-center">
              <Image
                unoptimized
                height={64}
                width={64}
                onError={handleBrokenImage}
                alt={"Part with number " + part.partNumber}
                src={process.env.NEXT_PUBLIC_API_URL + "/" + part.imagePath}
              />
            </div>
          </Link>
        )}
      </TableCell>
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
      <TableCell>
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger>
            <SquarePen />
          </SheetTrigger>
          <SheetContent className="overflow-y-auto">
            <SheetHeader className="mb-5">
              <SheetTitle>Parça Kaydı Güncelle</SheetTitle>
              <SheetDescription>
                Parçanın herhangi bir bilgisini buradan güncelleyebilirsiniz.
              </SheetDescription>
            </SheetHeader>
            <PartForm
              part={part}
              mode="PATCH"
              setIsOpen={setIsSheetOpen}
              setIsBrokenImage={setIsBrokenImage}
            />
          </SheetContent>
        </Sheet>
      </TableCell>
      <TableCell>
        <AlertDialog
          open={isAlertDialogOpen}
          onOpenChange={setIsAlertDialogOpen}
        >
          <AlertDialogTrigger>
            <Trash2 />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
              <AlertDialogDescription>
                Bu işlem geri alınamaz. Parça kaydı sunucularımızdan kalıcı
                olarak silinecektir.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>İptal</AlertDialogCancel>
              <Button variant="destructive" onClick={handleDelete}>
                Devam
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </TableCell>
    </TableRow>
  );
}

export default function PartTable() {
  const [data, setData] = useState<z.infer<typeof partSchema>[]>([]);
  const [isPending, setIsPending] = useState(true);
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
      const result = tableResponseSchema.safeParse(data);

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
    return (
      <div className="h-64 flex justify-center items-center gap-5">
        <LoaderCircle className="animate-spin" size={32} />
        <p>Envanter yükleniyor...</p>
      </div>
    );
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
            <TableHead className="text-center">Güncelle</TableHead>
            <TableHead className="text-center">Sil</TableHead>
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
