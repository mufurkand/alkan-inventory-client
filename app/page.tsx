"use client";

import { authAtom } from "@/atoms/auth";
import LoginForm from "@/components/LoginForm";
import { Separator } from "@/components/ui/separator";
import { useAtomValue } from "jotai";
import Link from "next/link";

export default function Home() {
  const auth = useAtomValue(authAtom);

  if (auth)
    return (
      <div className="flex justify-center items-center h-screen">
        <Link href="/parts">Table</Link>
      </div>
    );

  return (
    <div className="flex justify-center h-screen items-center">
      <div className="flex flex-col md:flex-row gap-5 md:h-72 items-center">
        <img
          alt="Alkan Teknoloji logosu"
          src="logo.png"
          className="h-64 w-64"
        />
        {/* avoiding the shadcn files like a plague */}
        <Separator className="hidden md:block" orientation="vertical" />
        <Separator className="block md:hidden" orientation="horizontal" />
        <LoginForm />
      </div>
    </div>
  );
}
