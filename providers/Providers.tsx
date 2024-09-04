"use client";

import { Provider, useSetAtom } from "jotai";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { authAtom } from "@/atoms/auth";
import { useEffect, useState } from "react";
import { statusResponseSchema } from "@/lib/schemas/responses";
import LoadingScreen from "@/components/LoadingScreen";

function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

function AuthProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const setAuth = useSetAtom(authAtom);
  const [isPending, setIsPending] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsPending(false);
      return;
    }

    // request to validate token
    async function validateToken() {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/api/auth/status",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      const result = statusResponseSchema.safeParse(data);

      if (result.success) {
        setAuth(result.data);
      } else {
        localStorage.removeItem("token");
      }

      setIsPending(false);
    }

    validateToken();
  }, []);

  return isPending ? <LoadingScreen /> : children;
}

export default function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Provider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <AuthProvider>{children}</AuthProvider>
      </ThemeProvider>
    </Provider>
  );
}
