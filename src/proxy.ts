import { auth } from "@/auth";
import { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  return auth(request);
}

export default proxy;

export const config = {
  matcher: ["/admin/:path*"],
};
