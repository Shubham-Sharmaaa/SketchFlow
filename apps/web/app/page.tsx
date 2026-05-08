import { cookies } from "next/headers";
import Home from "./_components/Home";
import { redirect } from "next/navigation";
export default async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) {
    return redirect("/auth/signup");
  }
  return <Home />;
}
