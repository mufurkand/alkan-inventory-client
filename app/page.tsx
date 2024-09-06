"use client";

import LoginForm from "@/components/LoginForm";
import HomePage from "@/components/HomePage";

import { authAtom } from "@/atoms/auth";
import { Separator } from "@/components/ui/separator";
import { useAtomValue } from "jotai";

export default function Home() {
  const auth = useAtomValue(authAtom);

  if (auth) return <HomePage />;

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
