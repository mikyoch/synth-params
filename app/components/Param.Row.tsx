"use client";

import { Owner } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export interface Row {
  id: number;
  uid: number;
  createdAt: Date;
  updatedAt: Date;
  dir: number[];
  gap: number;
  dirEth: number[];
  gapEth: number;
  dirXAU: number[];
  gapXAU: number;
  index: number;
  owner: Owner;
}

function getHoursBetweenDates(date1: Date, date2: Date) {
  const diffInMs = Math.abs(
    new Date(date2).getTime() - new Date(date1).getTime()
  ); // Difference in milliseconds
  return Number(diffInMs / (1000 * 60 * 60)).toFixed(2); // Convert ms to hours
}

export default function ParamRow(
  props: Row & { noIndex: number } & { rank: number | null }
) {
  const router = useRouter();

  const [mode, setMode] = useState<"view" | "edit">("view");
  const [dir, setDir] = useState<string>(JSON.stringify(props.dir));
  const [gap, setGap] = useState<string>(props.gap.toString());
  const [dirEth, setDirEth] = useState<string>(JSON.stringify(props.dirEth));
  const [gapEth, setGapEth] = useState<string>(props.gapEth.toString());
  const [dirXAU, setDirXAU] = useState<string>(JSON.stringify(props.dirXAU));
  const [gapXAU, setGapXAU] = useState<string>(props.gapXAU?.toString());
  const [index, setIndex] = useState<number>(props.index);
  const [idle, setIdle] = useState<boolean>(true);
  const [owner, setOwner] = useState<Owner>(props.owner);

  const saveHandler = async () => {
    try {
      setIdle(false);
      const response = await fetch("/api/update-params", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: props.id,
          uid: props.uid,
          dir: JSON.parse(dir),
          gap: Number(gap),
          dirEth: JSON.parse(dirEth),
          gapEth: Number(gapEth),
          dirXAU: JSON.parse(dirXAU),
          gapXAU: Number(gapXAU),
          index: index,
          owner,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update params");
      }

      const data = await response.json();
      console.log("Update successful:", data);
      router.refresh();
    } catch (e) {
      console.error(e);
      alert("Error occurred while updating the params");
    } finally {
      setMode("view");
      setIdle(true);
    }
  };

  const deleteMinerHandler = async () => {
    const uidToRemove = window.prompt(
      "Are you sure you want to delete this miner? Type UID to confirm."
    );
    if (Number(uidToRemove) !== Number(props.uid)) {
      alert("You typed wrong uid to remove! Operation canceled");
      return;
    }

    try {
      setIdle(false);
      const response = await fetch("/api/update-params", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: props.id,
          uid: props.uid,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete params");
      }

      const data = await response.json();
      console.log("Delete successful:", data);
      router.refresh();
    } catch (e) {
      console.error(e);
      alert("Error occurred while deleting the params");
    } finally {
      setIdle(true);
    }
  };

  return (
    <tr
      className="border border-white *:text-center hover:bg-white/10 transition-all duration-150"
      key={props.uid}
    >
      <td>
        <div className="flex items-center gap-2 justify-center">
          <span className="font-semibold">{props.noIndex}</span>
          {props.rank && props.rank < 10 && <span>/ {props.rank}</span>}
        </div>
      </td>
      <td>{props.uid}</td>
      <td>
        {mode === "edit" ? (
          <select
            className="text-black"
            value={owner}
            onChange={(e) => setOwner(e.target.value as Owner)}
          >
            {Object.values(Owner).map((item) => (
              <option>{item}</option>
            ))}
          </select>
        ) : (
          props.owner
        )}
      </td>
      <td>
        <input
          className="text-center text-black disabled:text-white"
          value={index}
          onChange={(e) => setIndex(Number(e.target.value))}
          type="text"
          disabled={mode !== "edit" || !idle}
        />
      </td>
      <td>
        <input
          className="text-center text-black disabled:text-white"
          disabled={mode !== "edit" || !idle}
          value={dir}
          onChange={(e) => setDir(e.target.value)}
          placeholder={props.dir.toString()}
          type="text"
        />
      </td>
      <td>
        <input
          className="text-center text-black disabled:text-white"
          disabled={mode !== "edit" || !idle}
          value={gap}
          onChange={(e) => setGap(e.target.value)}
          placeholder={props.gap.toString()}
          type="text"
        />
      </td>
      <td>
        <input
          className="text-center text-black disabled:text-white"
          disabled={mode !== "edit" || !idle}
          value={dirEth}
          onChange={(e) => setDirEth(e.target.value)}
          placeholder={props.dirEth.toString()}
          type="text"
        />
      </td>
      <td>
        <input
          className="text-center text-black disabled:text-white"
          disabled={mode !== "edit" || !idle}
          value={gapEth}
          onChange={(e) => setGapEth(e.target.value)}
          placeholder={props.gapEth.toString()}
          type="text"
        />
      </td>
      <td>
        <input
          className="text-center text-black disabled:text-white"
          disabled={mode !== "edit" || !idle}
          value={dirXAU}
          onChange={(e) => setDirXAU(e.target.value)}
          placeholder={props.dirXAU?.toString()}
          type="text"
        />
      </td>
      <td>
        <input
          className="text-center text-black disabled:text-white"
          disabled={mode !== "edit" || !idle}
          value={gapXAU}
          onChange={(e) => setGapXAU(e.target.value)}
          placeholder={props.gapXAU?.toString()}
          type="text"
        />
      </td>
      <td>{getHoursBetweenDates(new Date(), new Date(props.updatedAt))} hrs</td>
      <td>
        {mode === "edit" && (
          <button onClick={saveHandler} className="mr-5">
            Save
          </button>
        )}
        <button onClick={() => setMode(mode === "view" ? "edit" : "view")}>
          {mode === "edit" ? "Cancel" : "Edit"}
        </button>
        {mode === "view" && (
          <button onClick={deleteMinerHandler} className="ml-5">
            Delete
          </button>
        )}
      </td>
    </tr>
  );
}
