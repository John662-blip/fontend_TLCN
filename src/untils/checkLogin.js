"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getValidAccessToken } from "./getToken";

export function useCheckLogin() {
  const router = useRouter();
  const pathname = usePathname();
  const [token, setToken] = useState(null);

  useEffect(() => {
    // ✅ chỉ chạy ở client
    const checkToken = async () => {
      const validToken = await getValidAccessToken();
      setToken(validToken);

      if (!validToken && pathname !== "/login") {
        router.push("/login");
      }

      if (validToken && pathname === "/login") {
        router.push("/");
      }
    };

    checkToken();
  }, [router, pathname]);
}
