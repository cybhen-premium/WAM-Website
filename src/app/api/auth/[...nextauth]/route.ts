import { handlers } from "@/auth";

export const GET = (req: any) => {
  console.log("NextAuth GET request:", req.url);
  return handlers.GET(req);
};

export const POST = (req: any) => {
  console.log("NextAuth POST request:", req.url);
  return handlers.POST(req);
};
