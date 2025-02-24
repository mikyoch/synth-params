export const dynamic = "force-dynamic";

import Reward from "./components/Reward";
import Score from "./components/Score";
import Validate from "./components/Validate";
import Notification from "./components/Notification";
import prisma from "@/lib/prisma";
import Params from "./components/Params";

export default async function Home() {
  const data = await prisma.params.findMany({});
  const minerIDs = data.map((item: any) => item.uid);

  return (
    <div className="mx-5 md:mx-10 flex flex-col">
      {minerIDs.length !== 0 && (
        <div className="flex flex-row gap-10 w-full mb-2">
          <Validate miners={minerIDs} />
          <Score miners={minerIDs} />
          <Reward miners={minerIDs} />
        </div>
      )}

      <Params data={data} />

      <Notification />
    </div>
  );
}
