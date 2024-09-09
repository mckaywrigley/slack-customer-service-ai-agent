import { Dashboard } from "@/components/dashboard";
import { getProfileByUserId } from "@/db/queries/profiles-queries";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { userId } = auth();

  if (!userId) {
    return redirect("/login");
  }

  const profile = await getProfileByUserId(userId);

  if (!profile) {
    return redirect("/signup");
  }

  //   if (profile.membership === "free") {
  //     return redirect("/pricing");
  //   }

  return <Dashboard />;
}
