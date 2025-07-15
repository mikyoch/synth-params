export const dynamic = "force-dynamic";

import Reward from "../components/Reward";
import Score from "../components/Score";
import Validate from "../components/Validate";
import Notification from "../components/Notification";
import Params from "../components/Params";

import prisma from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LogOut from "../components/Logout";
import AddColdkey from "../components/AddColdkey";

export default async function Home() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: userData } = await supabase.auth.getSession();
  if (
    !userData?.session ||
    !process.env.NEXT_PUBLIC_ADMIN_GITHUB_HANDLE?.split(",").includes(
      userData?.session?.user?.user_metadata?.user_name
    )
  ) {
    return redirect("/");
  }

  const data = await prisma.params.findMany({});
  const coldkeys = await prisma.coldkeys.findMany({});
  const minerIDs = data.map((item: any) => item.uid);

  return (
    <div className="mx-5 md:mx-10 flex flex-col gap-1">
      {minerIDs.length !== 0 && (
        <div className="flex flex-row gap-10 w-full mb-2">
          <Validate miners={minerIDs} />
          <Score miners={minerIDs} />
          <Reward miners={minerIDs} coldkeys={coldkeys} />
        </div>
      )}

      {/* @ts-ignore prisma issue */}
      <Params miners={minerIDs} data={data} />

      <AddColdkey />

      <LogOut />

      <Notification />
    </div>
  );
}
