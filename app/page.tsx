import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth";

export default async function RootPage() {
  const me = await getCurrentProfile();
  redirect(me ? "/home" : "/login");
}
