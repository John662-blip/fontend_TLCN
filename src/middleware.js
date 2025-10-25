import { NextResponse } from "next/server";

export function middleware(req) {
  const accessToken = req.cookies.get("access_token")?.value;
  const refreshToken = req.cookies.get("refresh_token")?.value;
  const { pathname } = req.nextUrl;

  // ❌ Nếu không có cả access_token lẫn refresh_token → về login
  if (!accessToken && !refreshToken && pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // ✅ Nếu đã đăng nhập (có token) mà truy cập /login → về trang chủ
  if ((accessToken || refreshToken) && pathname === "/login") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // ✅ Cho phép truy cập, client sẽ dùng getValidAccessToken() để refresh nếu cần
  return NextResponse.next();
}

// export const config = {
//   matcher: [
//     "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(png|jpg|jpeg|svg)$).*)",
//   ],
// };
export const config = {
  matcher: ["/", "/login","/profile","/email-summary-sidebar","/sent-mails","/star","/mail/:path*"],
};
