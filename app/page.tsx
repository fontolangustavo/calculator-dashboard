import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE } from "@/lib/cookies";

export default function Home() {
  const token = cookies().get(SESSION_COOKIE)?.value;

  if (token) {
    redirect("/dashboard");
  } else {
    redirect("/login");
  }

  return null;
}
