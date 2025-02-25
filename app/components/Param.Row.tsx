'use client'

import { useRouter } from "next/navigation";
import { useState } from "react";

export interface Row {
  id: number,
  uid: number,
  createdAt: Date,
  updatedAt: Date,
  dir: number[],
  gap: number,
  index: number
}

function getHoursBetweenDates(date1: Date, date2: Date) {
  const diffInMs = Math.abs(new Date(date2).getTime() - new Date(date1).getTime()); // Difference in milliseconds
  return Number(diffInMs / (1000 * 60 * 60)).toFixed(2); // Convert ms to hours
}

export default function ParamRow(props: Row) {
  const router = useRouter();

  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const [dir, setDir] = useState<string>(JSON.stringify(props.dir));
  const [gap, setGap] = useState<string>(props.gap.toString());
  const [index, setIndex] = useState<number>(props.index);
  const [idle, setIdle] = useState<boolean>(true);

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
    const ok = window.confirm("Are you sure you want to delete this miner?")
    if (!ok) return;

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
  }

  return <tr className="border border-white *:text-center" key={props.uid}>
    <td>{props.uid}</td>
    <td><input className="text-center text-black disabled:text-white" value={index} onChange={(e) => setIndex(Number(e.target.value))} type="number" /></td>
    <td><input className="text-center text-black disabled:text-white" disabled={mode !== 'edit' || !idle} value={dir} onChange={(e) => setDir(e.target.value)} placeholder={props.dir.toString()} type='string' /></td>
    <td><input className="text-center text-black disabled:text-white" disabled={mode !== 'edit' || !idle} value={gap} onChange={(e) => setGap(e.target.value)} placeholder={props.gap.toString()} type='number' /></td>
    <td>{getHoursBetweenDates(new Date(), new Date(props.updatedAt))} hrs</td>
    <td>
      {mode === 'edit' && <button onClick={saveHandler} className="mr-5">Save</button>}
      <button onClick={() => setMode(mode === 'view' ? 'edit' : 'view')}>{mode === 'edit' ? "Cancel" : "Edit"}</button>
      {
        mode === 'view' && <button onClick={deleteMinerHandler} className="ml-5">Delete</button>
      }
    </td>
  </tr>
}